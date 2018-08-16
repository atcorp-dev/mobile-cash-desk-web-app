import { Guid } from 'guid-typescript';
import { Company } from './../companies/company.model';
import { of, Subject, Subscriber, from } from 'rxjs';
import { Observable } from 'rxjs';
import { CreateItemDto } from './create-item.dto';
import { Item } from './item.model';
import { Injectable, Inject } from '@nestjs/common';
import * as CSV from 'csv-string';
import { map, switchMap } from 'rxjs/operators';

@Injectable()
export class InventoryService {

  constructor(
    @Inject('ItemRepository') private readonly itemRepository: typeof Item,
    @Inject('CompanyRepository') private readonly companyRepository: typeof Company,
  ) {}

  importFromCsv(file): Observable<any> {
    const data: Buffer = file.buffer;
    const csv = data.toString();
    const arr: Array<string[]> = CSV.parse(csv);
    const headers = arr.shift();
    this.validateHeaders(headers);
    const items = arr.map(values => {
      const [name, code, price, description, company] = values;
      return { name, code, price: this.toDecimal(price), description, company, companyId: null }
    });
    return this.removeItems(items).pipe(
      switchMap(() => this.fillCompanies(items)),
      switchMap(
        res => from(
          this.itemRepository.bulkCreate(res)
        )
      )
    );
  }

  private toDecimal(value: string): number {
    return Number.parseFloat(value && value.replace(',', '.')) || 0;
  }

  private validateHeaders(headers: Array<string>) {
    const validHeaders = ['NAME', 'CODE', 'PRICE', 'DESCRIPTION', 'CONTRAGENT'];
    validHeaders.forEach((validHeader, i) => {
      const header = headers[i] || '';
      if (header.toUpperCase() !== validHeader) {
        throw new Error('Invalid data structure')
      }
    });
  }

  private removeItems(items: Array<any>): Observable<any> {
    const codes = [];
    items.forEach(item => {
      if (codes.indexOf(item.code) == -1) {
        codes.push(item.code);
      }
    })
    return from(
      this.itemRepository.destroy({
        where: {
          code: codes
        }
      })
    );
  }

  private fillCompanies(items: any[]): Observable<any> {
    return Observable.create(async (observer: Subscriber<any>) => {
      const companyIds = {};
      const it = this.getIterator(items);
      let current = it.next();
      while(!current.done) {
        const item = current.value;
        const code = item.company;
        item.id = Guid.create().toString();
        if (companyIds[code]) {
          item.companyId = companyIds[code];
        } else {
          const company = await this.companyRepository.find({ where: { code } });
          if (company) {
            item.companyId = company.id;
            companyIds[code] = company.id;
          }
        }
        // observer.next({ items, companyIds });
        current = it.next();
      }
      observer.next(items);
      observer.complete();
    });
  }

  private getIterator(array: Array<any>) {
    var nextIndex = 0;

    return {
      next: function () {
        return nextIndex < array.length ?
          { value: array[nextIndex++], done: false } :
          { done: true };
      }
    }
  }
}

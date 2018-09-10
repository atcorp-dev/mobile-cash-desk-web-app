import { Guid } from 'guid-typescript';
import { Company } from './../companies/company.model';
import { from } from 'rxjs';
import { Observable } from 'rxjs';
import { Item } from './item.model';
import { Injectable, Inject } from '@nestjs/common';
import * as CSV from 'csv-string';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class InventoryService {

  private template = ['NAME', 'CODE', 'PRICE'];
  constructor(
    @Inject('ItemRepository') private readonly itemRepository: typeof Item,
    @Inject('CompanyRepository') private readonly companyRepository: typeof Company,
  ) {}

  importFromCsv(companyCode: string, file): Observable<any> {
    const data: Buffer = file.buffer;
    const csv = data.toString();
    const arr: Array<string[]> = CSV.parse(csv);
    console.log(arr[1]);
    const headers = arr.shift();
   // this.validateHeaders(headers);
    const items = arr.map(values => {
      const [name, code, price, description] = values;
      return { id: Guid.create().toString(), name, code, price: this.toDecimal(price), description, companyId: null }
    });
    return from (
      this.companyRepository.find({ where: { code: companyCode } })
    )
    .pipe(
      switchMap(company => {
        items.forEach(item => item.companyId = company.id);
        return this.removeItems(company.id, items)
      }),
      switchMap(() => from(
        this.itemRepository.bulkCreate(items)
      ))
    );
  }

  public getTemplate(): string {
    return this.template
      .join(';');
  }

  private toDecimal(value: string): number {
    return Number.parseFloat(value && value.replace(',', '.')) || 0;
  }

  private validateHeaders(headers: Array<string>) {
    const validHeaders = this.template;
    validHeaders.forEach((validHeader, i) => {
      const header = headers[i] || '';
      if (header.toUpperCase() !== validHeader) {
        console.log(headers.join(','));
        console.log(`${header} not equal ${validHeader}`);
        throw new Error('Invalid data structure')
      }
    });
  }

  private removeItems(companyId: string, items: Array<any>): Observable<any> {
    const codes = [];
    items.forEach(item => {
      if (codes.indexOf(item.code) == -1) {
        codes.push(item.code);
      }
    })
    return from(
      this.itemRepository.destroy({
        where: {
          code: codes,
          companyId
        }
      })
    );
  }

}

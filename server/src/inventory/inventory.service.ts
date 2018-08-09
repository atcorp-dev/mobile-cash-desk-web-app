import { Guid } from 'guid-typescript';
import { Contragent } from './../contragents/contragent.model';
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
    @Inject('ContragentRepository') private readonly contragentRepository: typeof Contragent,
  ) {}

  importFromCsv(file): Observable<any> {
    const data: Buffer = file.buffer;
    const csv = data.toString();
    const arr: Array<string[]> = CSV.parse(csv);
    const headers = arr.shift();
    this.validateHeaders(headers);
    const items = arr.map(values => {
      const [name, code, description, contragent] = values;
      return { name, code, description, contragent, contragentId: null }
    });
    return this.removeItems(items).pipe(
      switchMap(() => this.fillContragents(items)),
      switchMap(
        res => from(
          this.itemRepository.bulkCreate(res)
        )
      )
    );
  }

  private validateHeaders(headers: Array<string>) {
    const validHeaders = ['NAME', 'CODE', 'DESCRIPTION', 'CONTRAGENT'];
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

  private fillContragents(items: any[]): Observable<any> {
    return Observable.create(async (observer: Subscriber<any>) => {
      const contragentIds = {};
      const it = this.getIterator(items);
      let current = it.next();
      while(!current.done) {
        const item = current.value;
        const code = item.contragent;
        item.id = Guid.create().toString();
        if (contragentIds[code]) {
          item.contragentId = contragentIds[code];
        } else {
          const contragent = await this.contragentRepository.find({ where: { code } });
          if (contragent) {
            item.contragentId = contragent.id;
            contragentIds[code] = contragent.id;
          }
        }
        // observer.next({ items, contragentIds });
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

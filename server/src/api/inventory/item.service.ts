import { switchMap } from 'rxjs/operators';
import { Company } from './../companies/company.model';
import { Observable, from } from 'rxjs';
import { Item } from './item.model';
import { Injectable, Inject } from '@nestjs/common';


@Injectable()
export class ItemService {

  constructor(
    @Inject('ItemRepository') private readonly itemRepository: typeof Item
  ) { }

  getAll(where): Observable<Item[]> {
    return from(
      this.itemRepository.findAll({
        where,
        include: [{
          model: Company
        }]
      })
    )
  }

  remove(id: string): Observable<void> {
    return from(
      this.itemRepository.findById<Item>(id)
    ).pipe(
      switchMap(
        item => item.destroy()
      )
    );
  }
}

import { Sequelize } from 'sequelize-typescript';
import { switchMap } from 'rxjs/operators';
import { Company } from './../companies/company.model';
import { Observable, from, of } from 'rxjs';
import { Item } from './item.model';
import { Injectable, Inject } from '@nestjs/common';

const Op = Sequelize.Op;

export const ITEM_SELECT_ATTRIBUTES = [
  'id', 'name', 'code', 'barCode', 'price', 'companyId', 'categoryId'
];
@Injectable()
export class ItemService {

  limit = 30;

  constructor(
    @Inject('ItemRepository') private readonly itemRepository: typeof Item
  ) { }

  getAll(where, page): Observable<Item[]> {
    page = +page || 0;
    const limit = this.limit;
    const offset = limit * (page > 0 ? page -1 : 0);
    return from(
      this.itemRepository.findAll({
        attributes: ITEM_SELECT_ATTRIBUTES,
        where,
        include: [{
          model: Company
        }],
        limit,
        offset
      })
    )
  }

  getItemByCode(companyId: string, code: string): Observable<Item> {
    const where = { companyId, code };
    return from(
      this.itemRepository.findOne({ attributes: ITEM_SELECT_ATTRIBUTES, where })
    );
  }

  getItemByBarCode(companyId: string, barCode: string): Observable<Item> {
    const where = { companyId, barCode };
    return from(
      this.itemRepository.findOne({ attributes: ITEM_SELECT_ATTRIBUTES, where })
    );
  }

  getItemsByName(companyId: string, name: string): Observable<Item[]> {
    if (!name || name.length < 3) {
      return of([]);
    }
    const where = {
      companyId,
        name: { [Op.iLike]: `%${name}%`} 
    };
    return from(
        this.itemRepository.findAll({
        attributes: ITEM_SELECT_ATTRIBUTES,
        where
      })
    );
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

import { User } from './../user/user.model';
import { Sequelize } from 'sequelize-typescript';
import { switchMap, map } from 'rxjs/operators';
import { Company } from './../companies/company.model';
import { Observable, from, of } from 'rxjs';
import { Item } from './item.model';
import { Injectable, Inject } from '@nestjs/common';

const Op = Sequelize.Op;

export const ITEM_SELECT_ATTRIBUTES = [
  'id', 'name', 'code', 'barCode', 'price', 'companyId', 'categoryId', 'available'
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

  getAvailableByCode(companyId: string, code: string): Observable<Item[]> {
    return this.getCompanyGroupId(companyId).pipe(
      switchMap(groupId => {
        const where = Sequelize.literal(`
          exists (
            select "Item".id
            from get_allowed_companies('${groupId}'::uuid) ac
            where "Item"."companyId" = ac.id
            and "Item".available = true
            and "Item".code = '${code}'
          )
        `);
        return from(this.itemRepository.findAll({
          attributes: ITEM_SELECT_ATTRIBUTES,
          include: [{
            model: Company
          }],
          where
        })
        )
      }
      )
    )
  }

  getItemById(id: string): Observable<Item> {
    return from(
      this.itemRepository.findById(id)
    );
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

  private getCompanyGroupId(companyId): Observable<string> {
    return from(
      Company.sequelize.query(`
        WITH RECURSIVE companies AS (
          SELECT m.id, m.name, m.type, m.code, m."parentId"
          FROM "Company" m
          WHERE m.id = '${companyId}'::uuid
          UNION
          SELECT p.id, p.name, p.type, p.code, p."parentId"
          FROM "Company" p
          INNER JOIN companies c ON p.id = c."parentId"
        )
        SELECT companies.id
        FROM companies
        WHERE "parentId" IS NULL
        LIMIT 1
      `, { type: Sequelize.QueryTypes.SELECT })
    ).pipe(map((res: any[]) => res.length ? res[0].id : null ));
  }
}

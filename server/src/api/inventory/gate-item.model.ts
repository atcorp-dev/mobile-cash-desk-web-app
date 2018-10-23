import { Observable } from 'rxjs';
import { AdditionalField } from './item.model';
import { Table, Column, Sequelize, Model } from 'sequelize-typescript';
import { BaseModel } from '../base/base.model';


@Table
export class GateItem extends BaseModel<GateItem> {

  @Column(Sequelize.UUID)
  key: string;

  @Column
  name: string;

  @Column
  code: string;

  @Column
  extCode: string;

  @Column
  barCode: string;

  @Column(Sequelize.UUID)
  categoryId: string;

  @Column
  description: string;

  @Column(Sequelize.DECIMAL)
  price: number;

  @Column(Sequelize.UUID)
  companyId: string;

  /// <summary>
  /// Image in Base64 format
  /// </summary>
  @Column(Sequelize.TEXT({ length: 'long' }))
  image: string;

  @Column(Sequelize.JSONB)
  additionalFields: Array<AdditionalField>;

  @Column(Sequelize.BOOLEAN)
  available: boolean;

  @Column(Sequelize.JSONB)
  source: any;

  public static upsertItems(key: string): Observable<any> {
    return Observable.create(observer => {
      this.sequelize.query(`
        INSERT INTO "Item" (
          "createdById",
          "createdOn",
          "modifiedById",
          "modifiedOn",
          "extCode",
          "companyId",
          code,
          name,
          "barCode",
          description,
          available,
          "categoryId",
          price,
          image,
          "additionalFields",
          source
        )
        SELECT
          g."createdById",
          g."createdOn",
          g."modifiedById",
          g."modifiedOn",
          g."extCode",
          g."companyId",
          g.code,
          g.name,
          g."barCode",
          g.description,
          g.available,
          g."categoryId",
          g.price,
          g.image,
          g."additionalFields",
          g.source
        from "GateItem" g
        WHERE key = '${key}'::uuid
        ON CONFLICT ON CONSTRAINT "unique_constraint_company_ext_code"
        DO UPDATE SET
          "modifiedById" = EXCLUDED."modifiedById",
          "modifiedOn" = EXCLUDED."modifiedOn",
          code = EXCLUDED.code,
          name = EXCLUDED.name,
          "barCode" = EXCLUDED."barCode",
          description = EXCLUDED.description,
          available = EXCLUDED.available,
          "categoryId" = EXCLUDED."categoryId",
          price = EXCLUDED.price,
          image = EXCLUDED.image,
          "additionalFields" = EXCLUDED."additionalFields",
          source = EXCLUDED.source
      `)
      .spread((result, rowsAffected) => {
        observer.next(rowsAffected);
      })
      .catch(err => observer.error(err))
    });
  }

}
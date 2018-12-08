import { Category } from './../categories/category.model';
import { Company } from './../companies/company.model';
import { Table, Column, Sequelize, BelongsTo, ForeignKey, DefaultScope, Scopes } from 'sequelize-typescript';
import { BaseModel } from '../base/base.model';

export interface AdditionalField {
  name: string;
  value: string;
}

@DefaultScope({
  attributes: ['id', 'name', 'code', 'barCode', 'price', 'companyId', 'categoryId', 'available', 'additionalFields']
})
@Scopes({
  full: {
    attributes: ['id', 'name', 'code', 'barCode', 'price', 'companyId', 'categoryId', 'available', 'description', 'additionalFields'],
    include: [() => Company]
  }
})
@Table
export class Item extends BaseModel<Item> {

  @Column
  name: string

  @Column
  code: string;

  @Column
  extCode: string;

  @Column
  barCode: string;

  @BelongsTo(() => Category)
  category: Category;

  @ForeignKey(() => Category)
  @Column(Sequelize.UUID)
  categoryId: string;

  @Column
  description: string;

  @Column(Sequelize.DECIMAL)
  price: number;

  @BelongsTo(() => Company)
  company: Company;

  @ForeignKey(() => Company)
  @Column(Sequelize.UUID)
  companyId: string;

  /// <summary>
  /// Image in Base64 format
  /// </summary>
  @Column(Sequelize.TEXT({length: 'long'}))
  image: string;

  @Column(Sequelize.JSONB)
  additionalFields: Array<AdditionalField>;

  @Column(Sequelize.BOOLEAN)
  available: boolean;

  @Column(Sequelize.JSONB)
  source: any;

}
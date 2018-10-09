import { Category } from './../categories/category.model';
import { Company } from './../companies/company.model';
import { Table, Column, Sequelize, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { BaseModel } from '../base/base.model';

export interface AdditionalField {
  name: string;
  value: string;
}

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

  @Column(Sequelize.JSON)
  additionalFields: Array<AdditionalField>;

  @Column(Sequelize.BOOLEAN)
  available: boolean;

}
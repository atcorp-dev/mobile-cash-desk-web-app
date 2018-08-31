import { User } from './../user/user.model';
import { Item } from '../inventory/item.model';
import { Guid } from 'guid-typescript';
import { Table, Column, Model, IsUUID, PrimaryKey, Sequelize, HasMany, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { BaseModel } from '../base/base.model';

export enum CompanyType {
  Main,
  Child
}

@Table
export class Company extends BaseModel<Company> {

  @Column(Sequelize.SMALLINT)
  type: CompanyType;

  @Column
  name: string;

  @Column
  code: string;

  @Column
  email: string;

  @Column
  phone: string;

  @Column
  address: string;

  @BelongsTo(() => Company)
  parent: Company;

  @ForeignKey(() => Company)
  @Column(Sequelize.UUID)
  parentId: string;

  @HasMany(() => Company)
  children: Array<Company>

  @HasMany(() => Item)
  itemList: Array<Item>
}
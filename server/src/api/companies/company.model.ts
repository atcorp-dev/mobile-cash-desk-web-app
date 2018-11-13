import { Item } from '../inventory/item.model';
import { Table, Column, Sequelize, HasMany, BelongsTo, ForeignKey, DefaultScope, Scopes, IScopeIncludeOptions } from 'sequelize-typescript';
import { BaseModel } from '../base/base.model';

export enum CompanyType {
  Main,
  Child
}

@DefaultScope({
  attributes: ['id', 'name', 'code', 'phone', 'email', 'address', 'parentId', 'active'],
  include: [{ model: () => Company.scope('lookup'), as: 'parent' }]
})
@Scopes({
  full: {
    attributes: ['id', 'name', 'code', 'phone', 'email', 'address', 'parentId', 'active'],
    include: [{model: () => Company, as: 'parent'}]
  },
  lookup: {
    attributes: ['id', 'name', 'code'],
  }
})
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

  @Column
  active: boolean;

  @BelongsTo(() => Company)
  parent: Company;

  @ForeignKey(() => Company)
  @Column(Sequelize.UUID)
  parentId: string;

  @HasMany(() => Company)
  children: Array<Company>

  @HasMany(() => Item)
  itemList: Array<Item>

  @Column(Sequelize.JSONB)
  extras: any;

}
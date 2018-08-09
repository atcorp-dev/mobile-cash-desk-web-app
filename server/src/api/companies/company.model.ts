import { Item } from '../inventory/item.model';
import { Guid } from 'guid-typescript';
import { Table, Column, Model, IsUUID, PrimaryKey, Sequelize, HasMany } from 'sequelize-typescript';


@Table
export class Company extends Model<Company> {

  // @IsUUID(4)
  @PrimaryKey
  @Column(Sequelize.UUID)
  id: string;

  @Column
  name: string

  @Column
  code: string;

  @Column
  email: string;

  @Column
  phone: string;

  @Column
  address: string;

  @HasMany(() => Item)
  itemList: Array<Item>
}
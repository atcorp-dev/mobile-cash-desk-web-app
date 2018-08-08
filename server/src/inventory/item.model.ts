import { Contragent } from './../contragents/contragent.model';
import { Guid } from 'guid-typescript';
import { Table, Column, Model, IsUUID, PrimaryKey, Sequelize, BelongsTo, ForeignKey } from 'sequelize-typescript';


@Table
export class Item extends Model<Item> {

  // @IsUUID(4)
  @PrimaryKey
  @Column(Sequelize.UUID)
  id: string;

  @Column
  name: string

  @Column
  code: string;

  @Column
  description: string;

  @Column
  price: number;

  @BelongsTo(() => Contragent)
  contragent: Contragent;

  @ForeignKey(() => Contragent)
  @Column(Sequelize.UUID)
  contragentId: string;

}
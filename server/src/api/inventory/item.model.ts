import { Company } from './../companies/company.model';
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

  @Column(Sequelize.DECIMAL)
  price: number;

  @BelongsTo(() => Company)
  company: Company;

  @ForeignKey(() => Company)
  @Column(Sequelize.UUID)
  companyId: string;

}
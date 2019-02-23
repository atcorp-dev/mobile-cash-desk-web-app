import { Table, Column, Sequelize, BeforeUpdate, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { BaseModel } from '../base/base.model';
import { Company } from '../companies/company.model';

export class CartItemDto {

  id: string;
  cartId: string;
  name: string;
  code: string;
  barCode: string;
  price: number;
  discount: number;
  qty: number;
  dateTime: Date;
  company?: Company;
  companyId: string;
  image?: string;
}


@Table
export class Cart extends BaseModel<Cart> {

  @BelongsTo(() => Company)
  company: Company;

  @ForeignKey(() => Company)
  @Column(Sequelize.UUID)
  companyId: string;

  @Column
  type?: number;

  @Column
  clientInfo: string;

  @Column(Sequelize.JSONB)
  items: Array<CartItemDto>;


  @Column(Sequelize.JSONB)
  extras: any;


  @Column(Sequelize.JSONB)
  history: Array<any>;

  @BeforeUpdate
  public static saveHistory(instance: Cart) {
    const history = instance.history || [];
    history.push({
      date: new Date(),
      type: instance.type,
      clientInfo: instance.clientInfo,
      items: instance.items,
      extras: instance.extras
    });
    instance.history = history;
  }
}
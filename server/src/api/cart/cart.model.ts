import { Table, Column, Sequelize, BeforeUpdate } from 'sequelize-typescript';
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
  saveHistory() {
    const history = this.history || [];
    history.push({
      date: new Date(),
      type: this.type,
      clientInfo: this.clientInfo,
      items: this.items,
      extras: this.extras
    });
    this.history = history;
  }
}
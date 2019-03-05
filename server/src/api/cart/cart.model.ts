import { Table, Column, Sequelize, BeforeUpdate, BelongsTo, ForeignKey, Scopes, DefaultScope } from 'sequelize-typescript';
import { BaseModel } from '../base/base.model';
import { Company } from '../companies/company.model';
import { User } from '../user/user.model';
import { hash } from 'bcryptjs';

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

const getObjectHash = (object): string => {
  let hash = null;
  if (object) {
    const { type, clientInfo, items, extras } = object;
    const json = JSON.stringify({ type, clientInfo, items, extras });
    hash = Buffer.from(json).toString('base64');
  }
  return hash;
}

@DefaultScope({
  attributes: ['id', 'createdOn', 'createdById', 'companyId', 'type', 'items', 'extras'],
  include: [{model: () => User, as: 'createdBy'}]
})
@Scopes({
  full: {
    include: [{ model: () => User, as: 'createdBy' }]
  },
  raw: {}
})
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
    const currentDate = new Date();
    const historyItem = {
      date: currentDate,
      type: instance.type,
      clientInfo: instance.clientInfo,
      items: instance.items,
      extras: instance.extras
    };
    const historyItemHash = getObjectHash(historyItem);
    const lastHistoryItem = Object.assign({}, history[history.length - 1]);
    lastHistoryItem.date = currentDate;
    const lastHistoryItemHash = getObjectHash(lastHistoryItem);
    if (lastHistoryItemHash !== historyItemHash) {
      history.push(historyItem);
    }
    instance.history = history;
  }
}

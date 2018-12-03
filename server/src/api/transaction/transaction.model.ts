import { Company } from './../companies/company.model';
import { User } from './../user/user.model';
import { Table, Column, Sequelize, BelongsTo, ForeignKey, BeforeCreate, DefaultScope, Scopes } from 'sequelize-typescript';
import { BaseModel } from '../base/base.model';
import { Item } from '../inventory/item.model';

export enum PaymentType {
  Card = 0,
  Cash = 1,
}

export enum TransactionStatus {
  Pending = 0,
  Payed = 1,
  Rejected = 2,
  Recalculated = 3
}

export class TransactionItem {

  itemId: string;

  name: string;

  code: string;

  barCode: string;

  price: number;

  qty: number;

  extras: any;
}

export class StatusCannotBeChangedException extends Error {
  constructor() {
    super('Status cannot be changed in not pending transaction');
  }
}

@DefaultScope({
  attributes: ['id', 'companyId', 'dateTime', 'type', 'status', 'ownerId', 'itemList', 'totalPrice', 'cartId', 'orderNum'],
})
@Scopes({ 
  full: {
    attributes: ['id', 'companyId', 'dateTime', 'type', 'status', 'ownerId', 'itemList', 'totalPrice', 'cartId', 'orderNum', 'extras'],
    include: [{ model: () => User, as: 'owner' }]
  }
})
@Table
export class Transaction extends BaseModel<Transaction> {

  // #region Columns
  @BelongsTo(() => Company)
  company: Company;

  @ForeignKey(() => Company)
  @Column(Sequelize.UUID)
  companyId: string;

  @Column(Sequelize.SMALLINT)
  type: PaymentType;

  @Column
  dateTime: Date;

  @Column(Sequelize.SMALLINT)
  status: TransactionStatus;

  @BelongsTo(() => User)
  owner: User;

  @ForeignKey(() => User)
  @Column(Sequelize.UUID)
  ownerId: string;

  @Column(Sequelize.JSONB)
  itemList: Array<TransactionItem>;

  @Column(Sequelize.DOUBLE)
  totalPrice: number;

  @Column(Sequelize.UUID)
  cartId: string;

  @Column
  orderNum: string;

  @Column(Sequelize.JSONB)
  extras: any;

  // #endregion

  // #region Methods: Hooks
  @BeforeCreate
  static initOrderNum(instance: Transaction) {
    const orderNum = Array.prototype.filter.call(new Date().toISOString(), c => /^\d$/.test(c)).join('');
    instance.set('orderNum', orderNum);
  }

  @BeforeCreate
  static initStatus(instance: Transaction) {
    instance.set('status', TransactionStatus.Pending);
  }

  @BeforeCreate
  static setDateTime(instance: Transaction) {
    if (!instance.dateTime) {
      instance.set('dateTime', new Date());
    }
  }

  // #endregion

  // #region Methods: Pubic
  public markAsPending(user: User) {
    this.modifiedById = user.id;
    return this.setStatus(TransactionStatus.Pending);
  }
  public markAsPayed(user: User): Transaction {
    this.modifiedById = user.id;
    return this.setStatus(TransactionStatus.Payed);
  }

  public markAsRejected(user: User): Transaction {
    this.modifiedById = user.id;
    return this.setStatus(TransactionStatus.Rejected);
  }

  public recalculate(itemList: Array<TransactionItem>, user: User) { 
    
    const extras = this.extras || { historyItemList: [] };
    if (!Array.isArray(extras.historyItemList)) {
      extras.historyItemList = [];
    }
    extras.historyItemList.push(this.itemList);
    const newItems = this.itemList.map(item => {
      const transactionItem = itemList.find(
        dto => (item.itemId == dto.itemId) || (item.barCode == dto.barCode) || (item.code == dto.code)
      );
      if (transactionItem) {
        item.price = transactionItem.price;
        item.name = transactionItem.name;
        const keys = Object.keys(transactionItem);
        const extraData = {};
        const itemAttributes = Object.keys(Item.attributes);
        keys
          .filter(attribute => itemAttributes.indexOf(attribute) === -1
            && attribute != 'itemId'
            && attribute != 'qty')
          .forEach(key => extraData[key] = transactionItem[key]);
        const itemExtras = item.extras || {};
        item.extras = Object.assign({}, itemExtras, extraData);
      }
      return item;
    });
    this.itemList = newItems;
    this.extras = extras;
    this.setStatus(TransactionStatus.Recalculated);
  }

  public setExtraData(data) {
    if (!data) {
      return;
    }
    const attributes = (<any>this).attributes;
    const keys = Object.keys(data);
    const extraData = {};
    keys
      .filter(attribute => attributes.indexOf(attribute) === -1)
      .forEach(key => extraData[key] = data[key]);
    const extras = this.extras || {};
    this.extras = Object.assign({}, extras, { extraData });
  }
  // #endregion

  // #region Methods: Protected
  protected setStatus(status: TransactionStatus): Transaction {
    /*if (this.status != TransactionStatus.Pending && this.status != TransactionStatus.Recalculated) {
      throw new StatusCannotBeChangedException()
    }*/
    this.set('status', status);
    this.set('dateTime', new Date());
    return this;
  }
  // #endregion

}
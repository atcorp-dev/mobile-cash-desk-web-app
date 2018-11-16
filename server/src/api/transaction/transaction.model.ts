import { Company } from './../companies/company.model';
import { User } from './../user/user.model';
import { Table, Column, Sequelize, BelongsTo, ForeignKey, BeforeCreate } from 'sequelize-typescript';
import { BaseModel } from '../base/base.model';

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
  public markAsPayed(user: User): Transaction {
    this.modifiedById = user.id;
    return this.setStatus(TransactionStatus.Payed);
  }

  public markAsRejected(user: User): Transaction {
    this.modifiedById = user.id;
    return this.setStatus(TransactionStatus.Rejected);
  }

  public recalculate(itemList: Array<TransactionItem>) {
    const newItems = [];
    itemList.map(dto => {
      const transactionItem = this.itemList.find(i => i.itemId == dto.itemId);
      if (!transactionItem) {
        newItems.push(dto);
      } else {
        transactionItem.price = dto.price;
        transactionItem.name = dto.name;
        newItems.push(transactionItem);
      }
    });
    this.itemList = newItems;
    this.setStatus(TransactionStatus.Recalculated);
  }
  // #endregion

  // #region Methods: Protected
  protected setStatus(status: TransactionStatus): Transaction {
    if (this.status != TransactionStatus.Pending && this.status != TransactionStatus.Recalculated) {
      throw new StatusCannotBeChangedException()
    }
    this.set('status', status);
    return this;
  }
  // #endregion

}
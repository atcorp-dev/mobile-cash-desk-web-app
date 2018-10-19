import { Company } from './../companies/company.model';
import { User } from './../user/user.model';
import { Item } from '../inventory/item.model';
import { Table, Column, Sequelize, BelongsTo, ForeignKey, BeforeCreate } from 'sequelize-typescript';
import { BaseModel } from '../base/base.model';

export enum PaymentType {
  Card = 0,
  Cash = 1,
}

export enum TransactionStatus {
  Pending = 0,
  Payed = 1,
  Rejected = 2
}

export class StatusCannotBeChangedException extends Error {
  constructor() {
    super('Status cannot be changed in not pending transaction');
  }
}

@Table
export class Transaction extends BaseModel<Transaction> {

  @BelongsTo(() => Company)
  company: User;

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
  itemList: Array<Item>;

  @Column(Sequelize.DOUBLE)
  totalPrice: number;

  // #region Methods: Hooks
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
  public markAsPayed(): Transaction {
    return this.setStatus(TransactionStatus.Payed);
  }

  public markAsRejected(): Transaction {
    return this.setStatus(TransactionStatus.Rejected);
  }
  // #endregion

  // #region Methods: Protected
  protected setStatus(status: TransactionStatus): Transaction {
    if (this.status == TransactionStatus.Pending) {
      this.set('status', status);
    } else {
      throw new StatusCannotBeChangedException()
    }
    return this;
  }
  // #endregion

}
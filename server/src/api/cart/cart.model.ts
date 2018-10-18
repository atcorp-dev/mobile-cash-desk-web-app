import { Company } from './../companies/company.model';
import { User } from './../user/user.model';
import { Item } from '../inventory/item.model';
import { Table, Column, Sequelize, BelongsTo, ForeignKey, BeforeCreate } from 'sequelize-typescript';
import { BaseModel } from '../base/base.model';

export enum PaymentType {
  Card = 0,
  Cash = 1,
}

export enum CartStatus {
  Pending = 0,
  Payed = 1,
  Rejected = 2
}

export class StatusCannotBeChangedException extends Error {
  constructor() {
    super('Status cannot be changed in not pending cart');
  }
}

@Table
export class Cart extends BaseModel<Cart> {

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
  status: CartStatus;

  @BelongsTo(() => User)
  owner: User;

  @ForeignKey(() => User)
  @Column(Sequelize.UUID)
  ownerId: string;

  @Column(Sequelize.JSONB)
  itemList: Array<Item>

  // #region Methods: Hooks
  @BeforeCreate
  static initStatus(instance: Cart) {
    instance.set('status', CartStatus.Pending);
  }

  @BeforeCreate
  static setDateTime(instance: Cart) {
    if (!instance.dateTime) {
      instance.set('dateTime', new Date());
    }
  }

  // #endregion

  // #region Methods: Pubic
  public markAsPayed(): Cart {
    return this.setStatus(CartStatus.Payed);
  }

  public markAsRejected(): Cart {
    return this.setStatus(CartStatus.Rejected);
  }
  // #endregion

  // #region Methods: Protected
  protected setStatus(status: CartStatus): Cart {
    if (this.status == CartStatus.Pending) {
      this.set('status', status);
    } else {
      throw new StatusCannotBeChangedException()
    }
    return this;
  }
  // #endregion

}
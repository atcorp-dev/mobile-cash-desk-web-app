import { User } from './../user/user.model';
import { Guid } from 'guid-typescript';
import { Table, Column, Model, IsUUID, PrimaryKey, Sequelize, BelongsTo, ForeignKey, CreatedAt, UpdatedAt, BeforeUpdate, BeforeCreate } from 'sequelize-typescript';

export abstract class BaseModel<T extends Model<T>> extends Model<T> {

  // #region Columns
  @IsUUID(4)
  @PrimaryKey
  @Column(Sequelize.UUID)
  id: string;

  @CreatedAt
  @Column
  createdOn: Date;

  @BelongsTo(() => User)
  createdBy: User;

  @ForeignKey(() => User)
  @Column(Sequelize.UUID)
  createdById: string;

  @UpdatedAt
  @Column
  modifiedOn: Date;

  @BelongsTo(() => User)
  modifiedBy: User;

  @ForeignKey(() => User)
  @Column(Sequelize.UUID)
  modifiedById: string;
  // #endregion

  // #region Hooks
  @BeforeUpdate
  @BeforeCreate
  static setCreateUser(instance: BaseModel<any>) {
    const user = null;
    instance.createdBy = user;
    instance.modifiedBy = user;
  }

  @BeforeUpdate
  static setModifyUser(instance: BaseModel<any>) {
    const user = null;
    instance.modifiedBy = user;
  }

  @BeforeCreate
  static generateId(instance: BaseModel<any>) {
    if (!instance.id) {
      instance.id = Guid.create().toString();
    }
  }

  // #endregion
}
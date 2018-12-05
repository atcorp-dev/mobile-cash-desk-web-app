import { Guid } from 'guid-typescript';
import { Table, Column, Model, PrimaryKey, Sequelize, BelongsTo, ForeignKey, IsUUID, BeforeCreate, DefaultScope, Scopes } from 'sequelize-typescript';
import { Company } from '../companies/company.model';

export enum UserRole {
  Admin = 1,
  Owner = 2,
  Supervisor = 4,
  Operator = 8
}

@DefaultScope({
  attributes: ['id', 'code', 'login', 'email'],
})
@Scopes({
  full: {
    attributes: ['id', 'code', 'login', 'password', 'email', 'active', 'role', 'companyId']
  }
})
@Table
export class User extends Model<User> {
  
  @IsUUID(4)
  @PrimaryKey
  @Column(Sequelize.UUID)
  id: string;

  @Column
  login: string;

  @Column
  name: string;

  @Column
  code: string;

  @Column
  password: string;

  @Column
  email: string;

  @Column
  active: boolean;

  @Column(Sequelize.SMALLINT)
  role: number;

  @Column(Sequelize.JSONB)
  extras: any

  // @ForeignKey(() => Company)
  @Column(Sequelize.UUID)
  companyId: string;

  // #region Methods: Hooks
  @BeforeCreate
  static generateId(instance: Model<any>) {
    if (!instance.id) {
      instance.id = Guid.create().toString();
    }
  }

  // #endregion

}
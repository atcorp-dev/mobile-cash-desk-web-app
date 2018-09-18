import { Table, Column, Model, PrimaryKey, Sequelize } from 'sequelize-typescript';

export enum UserRole {
  Admin = 1,
  Owner = 2,
  Supervisor = 4,
  Operator = 8
}

@Table
export class User extends Model<User> {
  
  // @IsUUID(4)
  @PrimaryKey
  @Column(Sequelize.UUID)
  id: string;

  @Column
  login: string;

  @Column
  password: string

  @Column
  email: string

  @Column
  active: boolean

  @Column(Sequelize.SMALLINT)
  role: number

}
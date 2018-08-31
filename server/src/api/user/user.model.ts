import { Table, Column, Model, PrimaryKey, Sequelize } from 'sequelize-typescript';

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

 /* @Column(Sequelize.INTEGER)
  role: number*/

}
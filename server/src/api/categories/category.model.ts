import { Table, Column } from 'sequelize-typescript';
import { BaseModel } from '../base/base.model';

@Table
export class Category extends BaseModel<Category> {

  @Column
  name: string;

  @Column
  code: string;

}
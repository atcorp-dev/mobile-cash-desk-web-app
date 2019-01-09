import { AppService } from './../app.service';
import { GateItem } from './../api/inventory/gate-item.model';
import { Transaction } from './../api/transaction/transaction.model';
import { Category } from './../api/categories/category.model';
import { User } from './../api/user/user.model';
import { Item } from './../api/inventory/item.model';
import { Company } from './../api/companies/company.model';
import { Sequelize } from 'sequelize-typescript';
import { Cart } from '../api/cart/cart.model';

const config = require('../../config/sequelize-config.json');
let connectionConfig = process.env.DATABASE_URL || config.development;
const { DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD } = process.env;
if (DB_HOST && DB_DATABASE && DB_USERNAME && DB_PASSWORD) {
  connectionConfig = {
    host: DB_HOST,
    port: 5432,
    database: DB_DATABASE,
    username: DB_USERNAME,
    password: DB_PASSWORD,
    dialect: 'postgres',
    dialectOptions: {
      ssl: true
    }
  }
}

export const databaseProviders = [
  {
    provide: 'SequelizeToken',
    useFactory: async () => {
      const sequelize = new Sequelize(connectionConfig);
      sequelize.options.logging = false;
      sequelize.addModels([
        User,
        Category,
        Item,
        Company,
        Transaction,
        GateItem,
        Cart
      ]);
      // await sequelize.sync({ force: false });
      AppService.initCompanies();
      return sequelize;
    },
  },
];

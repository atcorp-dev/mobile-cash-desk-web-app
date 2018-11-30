import { AppService } from './../app.service';
import { GateItem } from './../api/inventory/gate-item.model';
import { Transaction } from './../api/transaction/transaction.model';
import { Category } from './../api/categories/category.model';
import { User } from './../api/user/user.model';
import { Item } from './../api/inventory/item.model';
import { Company } from './../api/companies/company.model';
import { Sequelize, ISequelizeConfig } from 'sequelize-typescript';

const config = require('../../config/sequelize-config.json');
const connectionConfig = process.env.DATABASE_URL || config.development;

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
        GateItem
      ]);
      // await sequelize.sync({ force: false });
      AppService.initCompanies();
      return sequelize;
    },
  },
];

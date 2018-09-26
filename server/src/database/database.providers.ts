import { Category } from './../api/categories/category.model';
import { User } from './../api/user/user.model';
import { Item } from './../api/inventory/item.model';
import { Company } from './../api/companies/company.model';
import { Sequelize } from 'sequelize-typescript';

const config = require('../../config/sequelize-config.json');
const connectionConfig = process.env.DATABASE_URL || config.development;

export const databaseProviders = [
  {
    provide: 'SequelizeToken',
    useFactory: async () => {
      const sequelize = new Sequelize(connectionConfig);
      sequelize.addModels([
        User,
        Category,
        Item,
        Company,
      ]);
      // await sequelize.sync({ force: false });
      return sequelize;
    },
  },
];

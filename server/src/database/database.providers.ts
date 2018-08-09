import { Item } from '../inventory/item.model';
import { Sequelize } from 'sequelize-typescript';
import { Company } from '../companies/company.model';

const config = require('../../config/sequelize-config.json');
const connectionConfig = process.env.DATABASE_URL || config.development;

export const databaseProviders = [
  {
    provide: 'SequelizeToken',
    useFactory: async () => {
      const sequelize = new Sequelize(connectionConfig);
      sequelize.addModels([
        Company,
        Item
      ]);
      await sequelize.sync({ force: true });
      return sequelize;
    },
  },
];

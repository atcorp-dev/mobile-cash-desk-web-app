import { Item } from './../inventory/item.model';
import { Sequelize } from 'sequelize-typescript';
import { Contragent } from '../contragents/contragent.model';

const config = require('../../config/sequelize-config.json');
const connectionConfig = process.env.DATABASE_URL || config.development;

export const databaseProviders = [
  {
    provide: 'SequelizeToken',
    useFactory: async () => {
      const sequelize = new Sequelize(connectionConfig);
      sequelize.addModels([
        Contragent,
        Item
      ]);
      await sequelize.sync({ force: false });
      return sequelize;
    },
  },
];

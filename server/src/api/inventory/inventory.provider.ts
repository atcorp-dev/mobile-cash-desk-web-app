import { Company } from './../companies/company.model';
import { Item } from './item.model';

export const inventoryProviders = [
  {
    provide: 'ItemRepository',
    useValue: Item
  },
  {
    provide: 'CompanyRepository',
    useValue: Company
  },
];

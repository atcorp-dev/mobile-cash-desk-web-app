import { Item } from '../inventory/item.model';
import { Company } from './company.model';

export const companyProviders = [
  {
    provide: 'CompanyRepository',
    useValue: Company
  },
  {
    provide: 'ItemRepository',
    useValue: Item
  },
];

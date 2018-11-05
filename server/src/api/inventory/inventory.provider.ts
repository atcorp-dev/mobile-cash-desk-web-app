import { GateItem } from './gate-item.model';
import { Company } from './../companies/company.model';
import { Item } from './item.model';

export const inventoryProviders = [
  {
    provide: 'ItemRepository',
    useValue: Item
  },
  {
    provide: 'GateItemRepository',
    useValue: GateItem
  },
  {
    provide: 'CompanyRepository',
    useValue: Company
  },
];

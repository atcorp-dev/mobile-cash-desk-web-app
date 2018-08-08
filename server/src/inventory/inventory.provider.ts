import { Item } from './item.model';

export const inventoryProviders = [
  {
    provide: 'ItemRepository',
    useValue: Item
  },
];

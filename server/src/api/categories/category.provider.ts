import { Item } from './../inventory/item.model';
import { Category } from './category.model';

export const CategoryProviders = [
  {
    provide: 'CategoryRepository',
    useValue: Category
  },
  {
    provide: 'ItemRepository',
    useValue: Item
  },
];

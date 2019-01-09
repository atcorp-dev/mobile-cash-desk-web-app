import { Item } from './../inventory/item.model';
import { Cart } from './cart.model';

export const CartProviders = [
  {
    provide: 'CartRepository',
    useValue: Cart
  },
  {
    provide: 'ItemRepository',
    useValue: Item
  },
];

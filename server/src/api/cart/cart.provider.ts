import { Cart } from './cart.model';

export const cartProviders = [
  {
    provide: 'CartRepository',
    useValue: Cart
  }
];

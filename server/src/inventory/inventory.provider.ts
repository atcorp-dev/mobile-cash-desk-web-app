import { Contragent } from './../contragents/contragent.model';
import { Item } from './item.model';

export const inventoryProviders = [
  {
    provide: 'ItemRepository',
    useValue: Item
  },
  {
    provide: 'ContragentRepository',
    useValue: Contragent
  },
];

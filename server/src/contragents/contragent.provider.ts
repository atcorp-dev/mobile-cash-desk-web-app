import { Item } from './../inventory/item.model';
import { Contragent } from './contragent.model';

export const contragentProviders = [
  {
    provide: 'ContragentRepository',
    useValue: Contragent
  },
  {
    provide: 'ItemRepository',
    useValue: Item
  },
];

import { Cart } from './cart.model';
import { Injectable, Inject } from '@nestjs/common';
import { Observable, from, of } from 'rxjs';
import { Item } from '../inventory/item.model';
import { switchMap } from 'rxjs/operators';
import { CartDto } from './cart.dto';

@Injectable()
export class CartService {

  public constructor(
    @Inject('CartRepository') private readonly cartRepository: typeof Cart,
    @Inject('ItemRepository') private readonly itemRepository: typeof Item
  ) { }

  getAll(): Observable<Array<Cart>> {
    const response = this.cartRepository.findAll();
    return from(response);
  }

  getById(id: string): Observable<Cart> {
    const response = this.cartRepository.findById<Cart>(id);
    return from(response);
  }

  create(cart: CartDto): Observable<Cart> {
    const response = this.cartRepository.create(cart);
    return from(response);
  }

  modify(id: string, dto: CartDto): Observable<Item> {
    return from(this.itemRepository.findById(id))
      .pipe(switchMap(item => {
        if (!dto) {
          return of(item);
        }
        Object.keys(dto)
          .filter(key => ['id'].indexOf(key) === -1)
          .forEach(key => {
            item.set(key, dto[key])
          });
        return item.save();
      }));
  }

}
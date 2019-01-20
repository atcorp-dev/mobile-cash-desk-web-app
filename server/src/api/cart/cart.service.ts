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

  create(dto: CartDto): Observable<Cart> {
    if (dto.id) {
      return from(this.cartRepository.findById(dto.id))
        .pipe(switchMap(cart => {
          if (!cart) {
            return from(this.cartRepository.create(dto));
          }
          Object.keys(dto)
            .forEach(key => {
              cart.set(key, dto[key])
            });
          return cart.save();
        }));
    } else {
      const response = this.cartRepository.create(dto);
      return from(response);
    }
  }

  modify(id: string, dto: CartDto): Observable<Cart> {
    return from(this.cartRepository.findById(id))
      .pipe(switchMap(cart => {
        if (!dto) {
          return of(cart);
        }
        Object.keys(dto)
          .filter(key => ['id', 'history'].indexOf(key) === -1)
          .forEach(key => {
            cart.set(key, dto[key])
          });
        return cart.save();
      }));
  }

}
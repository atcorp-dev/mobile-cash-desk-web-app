import { CreateCartDto } from './create-cart.dto';
import { User } from './../user/user.model';
import { Cart } from './cart.model';
import { Sequelize } from 'sequelize-typescript';
import { Injectable, Inject } from '@nestjs/common';
import { Observable, from, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

const Op = Sequelize.Op

@Injectable()
export class CartService {

  limit = 30;

  public constructor(
    @Inject('CartRepository') private readonly cartRepository: typeof Cart
  ) { }

  getAll(page?: number, user?: User): Observable<Array<Cart>> {
    const limit = this.limit;
    page = +page || 0;
    const offset = limit * (page > 0 ? page - 1 : 0);
    const ownerId = user && user.id;
    const response = this.cartRepository.findAll({ where: { ownerId }, limit, offset });
    return from(response);
  }

  getById(id: string): Observable<Cart> {
    return from (
      this.cartRepository.findById(id)
    );
  }

  create(companyId: string, createCartDto: CreateCartDto): Observable<Cart> {
    const values = Object.assign({}, createCartDto, { companyId })
    return from(
      Cart.create(values)
    )
  }

  markAsPayed(id: string): Observable<Cart> {
    return from(
      this.cartRepository.findById(id)
    ).pipe(
      map(cart => cart.markAsPayed()),
      switchMap(cart => cart.save())
    )
  }

  markAsRejected(id: string): Observable<Cart> {
    return from(
      this.cartRepository.findById(id)
    ).pipe(
      map(cart => cart.markAsRejected()),
      switchMap(cart => cart.save())
    )
  }
}

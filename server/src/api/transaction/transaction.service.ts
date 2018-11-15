import { CreateTransactionDto } from './create-transaction.dto';
import { User } from './../user/user.model';
import { Transaction, TransactionStatus } from './transaction.model';
import { Sequelize } from 'sequelize-typescript';
import { Injectable, Inject } from '@nestjs/common';
import { Observable, from, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

const Op = Sequelize.Op

@Injectable()
export class TransactionService {

  limit = 30;

  public constructor(
    @Inject('TransactionRepository') private readonly transactionRepository: typeof Transaction
  ) { }

  getAllPending(companyId: string): Observable<Array<Transaction>> {
    const response = this.transactionRepository.findAll({ where: { companyId, status: TransactionStatus.Pending }});
    return from(response);
  }

  getAllPayed(companyId: string): Observable<Array<Transaction>> {
    const response = this.transactionRepository.findAll({ where: { companyId, status: TransactionStatus.Payed }});
    return from(response);
  }

  getAllRejected(companyId: string): Observable<Array<Transaction>> {
    const response = this.transactionRepository.findAll({ where: { companyId, status: TransactionStatus.Rejected }});
    return from(response);
  }

  getAll(page?: number, user?: User): Observable<Array<Transaction>> {
    const limit = page ? this.limit : null;
    page = +page || 0;
    const offset = limit ? (limit * (page > 0 ? page - 1 : 0)) : null;
    const ownerId = user && user.id;
    const response = this.transactionRepository.findAll({ where: { ownerId }, limit, offset });
    return from(response);
  }

  getById(id: string): Observable<Transaction> {
    return from (
      this.transactionRepository.findById(id)
    );
  }

  create(companyId: string, createTransactionDto: CreateTransactionDto, user: User): Observable<Transaction> {
    const createdById = user.id;
    const modifiedById = user.id;
    const cartId = createTransactionDto.cartId;
    const values = Object.assign({}, createTransactionDto, { companyId, createdById, modifiedById });
    return from(
      this.transactionRepository.findOne({ where: { cartId }} )
    ).pipe(
      switchMap(transaction => {
        if (transaction) {
          Object.keys(values)
            .filter(key => ['id'].indexOf(key) === -1)
            .forEach(key => {
              transaction.set(key, values[key])
            });
          return from(transaction.save());
        } else {
          return from(this.transactionRepository.create(values));
        }
      }),
    )
  }

  markAsPayed(id: string, user: User): Observable<Transaction> {
    return from(
      this.transactionRepository.findById(id)
    ).pipe(
      map(transaction => transaction.markAsPayed(user)),
      switchMap(transaction => transaction.save())
    )
  }

  markAsRejected(id: string, user: User): Observable<Transaction> {
    return from(
      this.transactionRepository.findById(id)
    ).pipe(
      map(transaction => transaction.markAsRejected(user)),
      switchMap(transaction => transaction.save())
    )
  }
}

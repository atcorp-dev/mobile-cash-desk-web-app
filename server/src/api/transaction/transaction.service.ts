import { CreateTransactionDto } from './create-transaction.dto';
import { User } from './../user/user.model';
import { Transaction } from './transaction.model';
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

  create(companyId: string, createTransactionDto: CreateTransactionDto): Observable<Transaction> {
    const values = Object.assign({}, createTransactionDto, { companyId })
    return from(
      Transaction.create(values)
    )
  }

  markAsPayed(id: string): Observable<Transaction> {
    return from(
      this.transactionRepository.findById(id)
    ).pipe(
      map(transaction => transaction.markAsPayed()),
      switchMap(transaction => transaction.save())
    )
  }

  markAsRejected(id: string): Observable<Transaction> {
    return from(
      this.transactionRepository.findById(id)
    ).pipe(
      map(transaction => transaction.markAsRejected()),
      switchMap(transaction => transaction.save())
    )
  }
}

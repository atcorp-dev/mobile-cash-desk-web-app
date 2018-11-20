import { HttpService } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { NotifyTransactionDto } from './notify-transaction.dto';
import { CreateTransactionDto } from './create-transaction.dto';
import { User } from './../user/user.model';
import { Transaction, TransactionStatus, TransactionItem } from './transaction.model';
import { Sequelize } from 'sequelize-typescript';
import { Injectable, Inject } from '@nestjs/common';
import { Observable, from, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { AxiosRequestConfig } from 'axios';

const Op = Sequelize.Op

@Injectable()
export class TransactionService {

  limit = 30;

  public constructor(
    @Inject('TransactionRepository') private readonly transactionRepository: typeof Transaction,
    private readonly httpService: HttpService
  ) { }

  getAllPending(companyId: string): Observable<Array<Transaction>> {
    const response = this.transactionRepository.scope('full').findAll({ where: { companyId, status: TransactionStatus.Pending }, raw: true});
    return from(response).pipe(
      map(transactions => transactions.map(
        transaction => Object.assign(transaction, { clientInfo: transaction.extras && transaction.extras.clientInfo}, { extras: undefined })))
    );
  }

  getAllPayed(companyId: string): Observable<Array<Transaction>> {
    const response = this.transactionRepository.findAll({ where: { companyId, status: TransactionStatus.Payed }, raw: true});
    return from(response);
  }

  getAllRejected(companyId: string): Observable<Array<Transaction>> {
    const response = this.transactionRepository.findAll({ where: { companyId, status: TransactionStatus.Rejected }, raw: true});
    return from(response);
  }

  getAll(page?: number, user?: User): Observable<Array<Transaction>> {
    const limit = page ? this.limit : null;
    page = +page || 0;
    const offset = limit ? (limit * (page > 0 ? page - 1 : 0)) : null;
    const ownerId = user && user.id;
    const response = this.transactionRepository.findAll({ where: { ownerId }, limit, offset, raw: true });
    return from(response);
  }

  getById(id: string): Observable<Transaction> {
    return from (
      this.transactionRepository.findById(id, { raw: true })
    ).pipe(
      map(transaction => Object.assign(transaction, { clientInfo: transaction.extras && transaction.extras.clientInfo }, { extras: undefined }))
    );
  }

  create(companyId: string, createTransactionDto: CreateTransactionDto, user: User): Observable<Transaction> {
    const createdById = user.id;
    const modifiedById = user.id;
    const ownerId = user.id;
    const cartId = createTransactionDto.cartId;
    const values = Object.assign({}, createTransactionDto, { companyId, createdById, modifiedById, ownerId });
    return from(
      this.transactionRepository.findOne({ where: { cartId }} )
    ).pipe(
      switchMap(transaction => {
        if (transaction) {
          const isChangedItems = createTransactionDto.itemList!.length !== transaction.itemList!.length
          || transaction.itemList.some(item => {
            const newItem = createTransactionDto.itemList.find(i => i.itemId == item.itemId);
            if (!newItem) {
              return true;
            }
            return newItem.price != item.price || newItem.qty != item.qty;
          })
          if (isChangedItems) {
            transaction.markAsPending(user);
          }
          Object.keys(values)
            .filter(key => ['id', 'status', 'extras'].indexOf(key) === -1)
            .forEach(key => {
              transaction.set(key, values[key])
            });
          const extras = Object.assign({}, transaction.extras, createTransactionDto.extras, { isChangedItems });
          transaction.set('extras', extras);
          return from(transaction.save());
        } else {
          return from(this.transactionRepository.create(values));
        }
      }),
    )
  }

  markAsPayed(id: string, user: User): Observable<Transaction> {
    return from(
      this.transactionRepository.scope('full').findById(id)
    ).pipe(
      map(transaction => transaction.markAsPayed(user)),
      switchMap(transaction => transaction.save())
    )
  }

  markAsRejected(id: string, user: User): Observable<Transaction> {
    return from(
      this.transactionRepository.scope('full').findById(id)
    ).pipe(
      map(transaction => transaction.markAsRejected(user)),
      switchMap(transaction => transaction.save())
    )
  }

  notify(id: string, message: NotifyTransactionDto, user: User, showPush: boolean): Observable<any> {
    if (!Array.isArray(message && message.itemList)) {
      throw new BadRequestException('message.itemList must be Array of items')
    }
    showPush = true;
    return from(
      this.transactionRepository.scope('full').findById(id)
    ).pipe(
      switchMap(transaction => {
        const itemList = message.itemList.map(i => <TransactionItem>i)
        transaction.recalculate(itemList, user);
        if (message.bonusesAvailable) {
          transaction.extras = Object.assign({}, { bonusesAvailable: message.bonusesAvailable });
        }
        return transaction.save();
      }),
      switchMap(transaction => {
        const body = `Ціни переаховані`;
        const title = `Кошик`;
        const dto = {transactionId: transaction.id, caertId: transaction.cartId };
        const recipientId = transaction.extras && transaction.extras.recipientId;
        if (recipientId) {
          return this.sentPushMessage(recipientId, dto, body, title, showPush)
        } else {
          of('cannot notify recipient')
        }
      })
    );
  }

  sentPushMessage(to: string, payLoad: any, body: string, title: string, showPush: boolean): Observable<any> {
    const url = 'https://fcm.googleapis.com/fcm/send';
    const data = {
      to,
      'collapse_key': null,
      notification: showPush ? { body, title } : null,
      data: Object.assign({ body, title }, payLoad)
    }
    const serverKey = process.env.FCM_SERVER_KEY;
    const params = <AxiosRequestConfig>{
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `key=${serverKey}`
      }
    };
    return this.httpService.post(url, data, params).pipe(
      map(response => {
        if (response.status >= 200 && response.status < 300) {
          return response.data;
        } else {
          console.error(response);
          throw new BadRequestException(response.data);
        }
      }, err => {
        console.error(err);
        throw new BadRequestException(err);
      })
    );
  }
}

import { Guid } from 'guid-typescript';
import { OutputTransactionDto } from './dto/output-transaction.dto';
import { HttpService } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { NotifyTransactionDto } from './dto/notify-transaction.dto';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { User } from './../user/user.model';
import { Transaction, TransactionStatus, TransactionItem } from './transaction.model';
import { Sequelize, IsUUID } from 'sequelize-typescript';
import { Injectable, Inject } from '@nestjs/common';
import { Observable, from, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { AxiosRequestConfig } from 'axios';
import _ = require('lodash');

const Op = Sequelize.Op

@Injectable()
export class TransactionService {

  limit = 30;

  public constructor(
    @Inject('TransactionRepository') private readonly transactionRepository: typeof Transaction,
    private readonly httpService: HttpService
  ) { }

  getAllPending(companyId: string): Observable<Array<OutputTransactionDto>> {
    const response = this.transactionRepository.scope('full').findAll({
      where: {
        companyId,
        status: TransactionStatus.Pending,
        totalPrice: {
          [Op.gt]: 0
        }
      }
    });
    return from(response)
      .pipe(
        map(transactions => transactions
          .map(
            transaction => this.getOutputTransaction(transaction)
          )
        )
      );
  }

  getAllPayed(companyId: string, dateFrom: Date, dateTo: Date): Observable<Array<OutputTransactionDto>> {
    const opts = <any>{
      where: {
        companyId,
        status: TransactionStatus.Payed,
      }
    }
    if (dateFrom) {
      opts.where.dateTime = opts.where.dateTime || {};
      Object.assign(opts.where.dateTime, { [Op.gte]: dateFrom })
    }
    if (dateTo) {
      opts.where.dateTime = opts.where.dateTime || {};
      Object.assign(opts.where.dateTime, { [Op.lte]: dateTo })
    }
    const response = this.transactionRepository.scope('full').findAll(opts);
    return from(response)
      .pipe(
        map(transactions => transactions
          .map(
            transaction => this.getOutputTransaction(transaction)
          )
        )
      );
  }

  getAllRejected(companyId: string): Observable<Array<OutputTransactionDto>> {
    const response = this.transactionRepository.findAll({ where: { companyId, status: TransactionStatus.Rejected }});
    return from(response)
      .pipe(
        map(transactions => transactions
          .map(
            transaction => this.getOutputTransaction(transaction)
          )
        )
      );
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
      this.transactionRepository.scope('full').findById(id)
    )
    .pipe(
      map(transaction => {
        const extras = {
          clientInfo: transaction.extras && transaction.extras.clientInfo,
          bonusesAvailable: transaction.extras && transaction.extras.bonusesAvailable
        };
        const res = Object.assign(transaction, { extras });
        return res; 
      })
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
    const transactionQuery = (id && Guid.isGuid(id))
      ? this.transactionRepository.scope('full').findById(id)
      : this.transactionRepository.scope('full').findOne({ where: { documentNumber: id } })
    return from(transactionQuery)
      .pipe(
        switchMap(transaction => {
          const itemList = message.itemList.map(i => <TransactionItem>i)
          transaction.recalculate(itemList, user);
          transaction.setExtraData(message);
          if (message.bonusesAvailable) {
            transaction.extras = Object.assign({}, transaction.extras, { bonusesAvailable: message.bonusesAvailable });
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
            return of('cannot notify recipient')
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

  private getOutputTransaction(transaction: Transaction): OutputTransactionDto {
    const clientInfo = transaction.extras && transaction.extras.clientInfo;
    const transactionDto = transaction.get({ plain: true });
    const itemList = transactionDto.itemList.map(item => {
      return {
        itemId: item.itemId,
        barCode: item.barCode,
        price: item.price,
        qty: item.qty,
        DokumentAkciya: item.extras && item.extras.DokumentAkciya,
        NovayaCenaPostavshika: item.extras && item.extras.NovayaCenaPostavshika,
      }
    });
    const owner = transactionDto.owner || {};
    const res = <OutputTransactionDto>{
      id: transaction.id,
      documentNumber: transactionDto.documentNumber,
      dateTime: transactionDto.dateTime,
      userLogin: owner.login || owner.code,
      clientInfo,
      itemList,
    };
    return res;
  }
}

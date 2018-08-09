import { CreateItemDto } from './../inventory/create-item.dto';
import { Guid } from 'guid-typescript';
import { CreateContragentDto } from './create-contragent.dto';
import { Injectable, Inject } from '@nestjs/common';
import { Observable, from } from 'rxjs';
import { Contragent } from './contragent.model';
import { Item } from '../inventory/item.model';
import { map, switchMap } from 'rxjs/operators';

@Injectable()
export class ContragentService {

  public constructor(
    @Inject('ContragentRepository') private readonly contragentRepository: typeof Contragent,
    @Inject('ItemRepository') private readonly itemRepository: typeof Item
  ) {}

  getAll(): Observable<Array<Contragent>> {
    const response = this.contragentRepository.findAll();
    return from(response);
  }

  getById(id: string): Observable<Contragent> {
    const response = this.contragentRepository.findById<Contragent>(id);
    return from(response);
  }

  create(createContragent: CreateContragentDto): Observable<Contragent> {
    const id = Guid.create().toString();
    const contragent = Object.assign(createContragent, { id });
    const response = this.contragentRepository.create(contragent);
    return from(response);
  }

  getItems(id: string): Observable<Array<Item>> {
    const response = this.contragentRepository.findById(id, {
      include: [Item]
    });
    return from(response).pipe(
      map(i => i.itemList)
    );
  }

  addItem(id: string, itemDto: CreateItemDto): Observable<any> {
    const itemId = Guid.create().toString();
    const item = Object.assign(itemDto, {
      id: itemId,
      contragentId: id
    });
    const response = this.itemRepository.create(item);
    return from(response);
  }

}
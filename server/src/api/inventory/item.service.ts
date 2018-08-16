import { Company } from './../companies/company.model';
import { Observable, from } from 'rxjs';
import { Item } from './item.model';
import { Injectable, Inject } from '@nestjs/common';


@Injectable()
export class ItemService {

  constructor(
    @Inject('ItemRepository') private readonly itemRepository: typeof Item
  ) { }

  getAll(): Observable<Item[]> {
    return from(
      this.itemRepository.findAll({
        include: [{
          model: Company
        }]
      })
    )
  }
}

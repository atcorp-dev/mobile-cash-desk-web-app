import { CreateItemDto } from '../inventory/create-item.dto';
import { Guid } from 'guid-typescript';
import { CreateCompanyDto } from './create-company.dto';
import { Injectable, Inject } from '@nestjs/common';
import { Observable, from } from 'rxjs';
import { Company } from './company.model';
import { Item } from '../inventory/item.model';
import { map, switchMap } from 'rxjs/operators';

@Injectable()
export class CompanyService {

  public constructor(
    @Inject('CompanyRepository') private readonly companyRepository: typeof Company,
    @Inject('ItemRepository') private readonly itemRepository: typeof Item
  ) {}

  getAll(): Observable<Array<Company>> {
    const response = this.companyRepository.findAll();
    return from(response);
  }

  getById(id: string): Observable<Company> {
    const response = this.companyRepository.findById<Company>(id);
    return from(response);
  }

  create(createCompany: CreateCompanyDto): Observable<Company> {
    const id = Guid.create().toString();
    const company = Object.assign(createCompany, { id });
    const response = this.companyRepository.create(company);
    return from(response);
  }

  getItems(id: string): Observable<Array<Item>> {
    const response = this.companyRepository.findById(id, {
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
      companyId: id
    });
    const response = this.itemRepository.create(item);
    return from(response);
  }

}
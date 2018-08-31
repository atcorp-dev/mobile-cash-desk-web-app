import { CreateItemDto } from '../inventory/create-item.dto';
import { Guid } from 'guid-typescript';
import { CreateCompanyDto } from './create-company.dto';
import { Injectable, Inject } from '@nestjs/common';
import { Observable, from, of } from 'rxjs';
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
    const response = this.companyRepository.create(createCompany);
    return from(response);
  }

  remove(id: string): Observable<boolean> {
    return from (
      this.itemRepository.count({
        where: { companyId: id }
      })
    )
      .pipe(
        switchMap(count => {
          if (!count) {
            return this.companyRepository.findById<Company>(id);
          }
          return of(null);
        }),
        switchMap((company: Company) => { 
          if(company) {
            return company.destroy()
              .then(() => true);
          }
          return of(false);
        })
    );
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
    const item = Object.assign(itemDto, { companyId: id });
    const response = this.itemRepository.create(item);
    return from(response);
  }

}
import { Sequelize } from 'sequelize-typescript';
import { User } from './../user/user.model';
import { CreateItemDto } from '../inventory/create-item.dto';
import { CreateCompanyDto } from './create-company.dto';
import { Injectable, Inject } from '@nestjs/common';
import { Observable, from, of } from 'rxjs';
import { Company } from './company.model';
import { Item } from '../inventory/item.model';
import { switchMap } from 'rxjs/operators';

const Op = Sequelize.Op

@Injectable()
export class CompanyService {

  limit = 30;

  public constructor(
    @Inject('CompanyRepository') private readonly companyRepository: typeof Company,
    @Inject('ItemRepository') private readonly itemRepository: typeof Item
  ) {}

  getAll(page?: number, user?: User): Observable<Array<Company>> {
    const limit = this.limit;
    page = +page || 0;
    const offset = limit * (page > 0 ? page -1 : 0);
    const companyId = user && user.companyId;
    const where = companyId ? { [Op.or]: [{ id: companyId }, {parentId: companyId }] }: null;
    const response = this.companyRepository.findAll({ where, limit, offset });
    return from(response);
  }

  getById(id: string): Observable<Company> {
    const response = this.companyRepository.findById<Company>(id);
    return from(response);
  }

  create(createCompany: CreateCompanyDto): Observable<Company> {
    createCompany.parentId = createCompany.parentId ? createCompany.parentId : null;
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

  getItems(companyId: string, page?: number): Observable<Array<Item>> {
    const limit = this.limit;
    const offset = limit * (page || 0);
    const where = {
      companyId
    }
    const response = this.itemRepository.findAll({ where, limit, offset });
    return from(response);
  }

  /*getUsers(id: string): Observable<Array<User>> {
    const response = this.companyRepository.findById(id, {
      include: [User]
    });
    return from(response).pipe(
      map(i => i.users)
    );
  }*/

  addItem(id: string, itemDto: CreateItemDto): Observable<any> {
    const item = Object.assign(itemDto, { companyId: id });
    const response = this.itemRepository.create(item);
    return from(response);
  }

}
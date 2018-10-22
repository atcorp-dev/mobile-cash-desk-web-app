import { Company } from './../../companies/company.model';
import { Observable, from } from 'rxjs';
import { IntegrationService, ImportResult } from './../integration.service';
import { Injectable, Inject, HttpService } from "@nestjs/common";
import { Item, AdditionalField } from '../../inventory/item.model';
import { map, tap, switchMap } from 'rxjs/operators';
import { User } from '../../user/user.model';
import sequelize = require('sequelize');

export class PrestaShopIntegrationConfig {
  domain: string;
  type: string;
  authToken: string;
}

declare class Items extends Array<Item> {};
declare class Products extends Array<any> {};
declare class Product {
  [key:string]: any;
};

@Injectable()
export class PrestaShopIntegrationService implements IntegrationService {

  protected config: PrestaShopIntegrationConfig;
  protected lastImportDate: Date;
  protected transaction: sequelize.Transaction;
  protected inserted = 0;
  protected updated = 0;

  constructor(
    private readonly httpService: HttpService,
    @Inject('ItemRepository') private readonly itemRepository: typeof Item
    ) {}

  protected get uri() {
    const { domain, type } = this.config;
    return `${type}://${domain}/api`;
  }

  public importItems(args: { company: Company, user?: User }): Observable<ImportResult> {
    const { company, user } = args;
    const companyId = company.id;
    this.config = company.extras && company.extras.integrationConfig && company.extras.integrationConfig.config;
    this.lastImportDate = company.extras && company.extras.integrationConfig && company.extras.integrationConfig.lastImportDate;
    company.extras.integrationConfig.lastImportDate = new Date();
    return this.beginTransaction().pipe(
      switchMap(() => this.getProducts(this.lastImportDate)),
      switchMap(products => this.upsertItems(products, company, user)),
      switchMap(res => company.save()),
      switchMap(() => this.commitTransaction(this.transaction, null))
    )
  }

  protected beginTransaction(): Observable<sequelize.Transaction> {
    return from(
      this.itemRepository.sequelize.transaction()
    ).pipe(
      tap(transaction => this.transaction = transaction)
    )
  }

  protected commitTransaction(transaction: sequelize.Transaction, res: ImportResult): Observable<ImportResult> {
    return from(
      transaction.commit()
    ).pipe(
      map(() => res)
    )
  }

  protected getProducts(lastImportDate: Date): Observable<Products> {
    const display = lastImportDate ? 'full' : '[id,reference,quantity,price,active,meta_title,name,description]'
    const filter = `[|${new Date().toISOString()}]`
    const filterKey = 'filter[date_upd]'
    const config = {
      headers: {
        authorization: `Basic ${this.config.authToken}`
      },
      params: {
        'output_format': 'JSON',
        display
      }
    }
    return this.httpService.get(`${this.uri}/products`, config).pipe(
      map(res => (res && res.data && res.data.products) || [])
    );
  }

  protected upsertItems(products: Products, company: Company, user: User): Observable<ImportResult> {
    return Observable.create(observer => {
      const it = this.getIterator(products);
      const items: Items = [];
      const upsert = () => {
        const current = it.next();
        this.upsertItem(current.value, company, user)
        .subscribe(item => {
          items.push(item);
          if (!current.done) {
            upsert();
          } else {
            observer.next(<ImportResult>{
              rowsInserted: this.inserted,
              rowsUpdated: this.updated
            })
          }
        });
        upsert();
      }
    });
  }

  protected upsertItem(product: Product, company: Company, user: User): Observable<Item> {
    const itemDto = this.getItem(product, company.id, user);
    const opts = {
      where: { code: product.reference },
      transaction: this.transaction
    }
    return from(this.itemRepository.findOrCreate(opts)
    .spread((item: Item, created) => {
      if (!created) {
        this.inserted++;
        Object.assign(item, itemDto);
        return item.save();
      }
      this.updated++;
      return Promise.resolve(item);
    }));
  }

  protected getProductById(id: number): Observable<Product> {
    const display = 'full'
    const config = {
      headers: {
        authorization: `Basic ${this.config.authToken}`
      },
      params: {
        'output_format': 'JSON',
        display
      }
    }
    return this.httpService.get(`${this.uri}/products/${id}`, config).pipe(
      map(res => <Product>(res && res.data && res.data.product) || {})
    );
  }

  protected getItem(row: Product, companyId: string, user: User): Item {
    return <Item>{
      createdById: user && user.id,
      modifiedById: user && user.id,
      extCode: row.id,
      available: +row.active === 1 && +row.quantity > 0,
      code: row.reference,
      companyId,
      name: row.name[0].value,
      price: +row.price || 0,
      additionalFields: this.getAdditionalFields(row),
      source: row
    }
  }

  protected getAdditionalFields(row): any {
    const description: string = row.description && row.description && row.description[0].value;
    if (description) {
      return [<AdditionalField>{ name: '', value: description.replace(/<[^>]+>/g, '') }];
      /*return description.split('\n')
      .map(v => /<p>(.*?)<\/p>/.exec(v) || v)
      .map((m: any) => m[1] || m.input || m)
      .map(values => {
        const parts = values.split(' ');
        const name = parts.splice(0, 1)[0];
        const value = parts.join(' ');
        return <AdditionalField>{ name, value }
      });*/
    }
    return null;
  }

  protected getIterator(arr: Array<any>): Iterator<any> {
    return (function* iterate() {
      for(let i = 0; i < arr.length; i++) {
        yield arr[i];
      }
    })();
  }
}
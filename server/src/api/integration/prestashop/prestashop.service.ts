import { Guid } from 'guid-typescript';
import { GateItem } from './../../inventory/gate-item.model';
import { Company } from './../../companies/company.model';
import { Observable, from, of } from 'rxjs';
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
declare class Stocks extends Array<any> {};
declare class Product {
  [key:string]: any;
};

@Injectable()
export class PrestaShopIntegrationService implements IntegrationService {

  protected config: PrestaShopIntegrationConfig;
  protected lastImportDate: Date;
  protected transaction: sequelize.Transaction;
  protected rowsAffected = 0;

  constructor(
    private readonly httpService: HttpService,
    @Inject('ItemRepository') private readonly itemRepository: typeof Item,
    @Inject('GateItemRepository') private readonly gateItemRepository: typeof GateItem
    ) {}

  protected get uri() {
    const { domain, type } = this.config;
    return `${type}://${domain}/api`;
  }

  public importItems(args: { company: Company, user?: User }): Observable<ImportResult> {
    const { company, user } = args;
    const integrationConfig = company.extras && company.extras.integrationConfig;
    if (!integrationConfig) {
      const companyName = company && company.name || '';
      throw new Error(`No integration config fo this company [${companyName}]`);
    }
    this.config = integrationConfig.config;
    this.lastImportDate = integrationConfig.lastImportDate;
    company.extras.integrationConfig.lastImportDate = new Date();
    return this.beginTransaction().pipe(
      switchMap(() => this.getStocks()),
      switchMap(stocks => this.getProducts(stocks, this.lastImportDate)),
      switchMap(products => this.upsertItems(products, company, user)),
      switchMap(res => company.save()),
      switchMap(() => this.commitTransaction(this.transaction))
    )
  }

  protected beginTransaction(): Observable<sequelize.Transaction> {
    return from(
      this.itemRepository.sequelize.transaction()
    ).pipe(
      tap(transaction => this.transaction = transaction)
    )
  }

  protected commitTransaction(transaction: sequelize.Transaction): Observable<ImportResult> {
    return from(
      transaction.commit()
    ).pipe(
      map(() => <ImportResult>{
        rowsAffected: this.rowsAffected
      })
    )
  }

  protected getStocks(): Observable<Stocks> {
    const config: any = {
      headers: {
        authorization: `Basic ${this.config.authToken}`
      },
      params: {
        'output_format': 'JSON',
        display: '[id,quantity]'
      }
    }
    return this.httpService.get(`${this.uri}/stock_availables`, config).pipe(
      map(res => {
        const stocks: Stocks = res.data && res.data['stock_availables'];
        return stocks;
      })
    )
  }

  protected getProducts(stocks: Stocks, lastImportDate: Date): Observable<Products> {
    const dateFrom = this.getPhpDate(lastImportDate || new Date(2000,0,1));
    const dateTo = this.getPhpDate(new Date());
    const filter = `[${dateFrom}|${dateTo}]`;
    const filterKey = 'filter[date_upd]'
    const config: any = {
      headers: {
        authorization: `Basic ${this.config.authToken}`
      },
      params: {
        'output_format': 'JSON',
        display: '[id,reference,price,active,name,description,stock_availables[id]]',
        //[filterKey]: filter
      }
    }
    const limit = 500;
    const resultProducts = [];
    return Observable.create(observer => {
      const fetchProducts = page => {
        console.time(`fetching page #${page}`);
        const offset = page * limit;
        config.params.limit = `${offset},${limit}`;
        this.httpService.get(`${this.uri}/products`, config)
        .subscribe(res => {
          const products: Products = res && res.data && res.data.products || [];
          console.timeEnd(`fetching page #${page}`);
          if (!products.length) {
            console.timeEnd(`fetching products`);
            console.debug(`fetched ${resultProducts.length} rows`);
            resultProducts.forEach(
              product => {
                if (product.associations && Array.isArray(product.associations['stock_availables'])) {
                  const stockId = +(product.associations['stock_availables'][0].id);
                  product.stock = stocks.find(stock => stock.id === stockId);
                }
              }
            )
            observer.next(resultProducts);
          } else {
            resultProducts.push(...products);
            fetchProducts(page + 1);
          }
        }, err => observer.error(err));
      };
      console.time(`fetching products`);
      fetchProducts(0);
    });
  }

  protected upsertItems(products: Products, company: Company, user: User): Observable<ImportResult> {
    const key = Guid.create().toString();
    const items = products.map(x => this.getItem(x, company.id, user, key));
    this.rowsAffected = items.length;
    return from(
      this.gateItemRepository.bulkCreate(items)
    ).pipe(
      switchMap(() => GateItem.upsertItems(key)),
      switchMap(() => GateItem.destroy({ where: { key }})),
      map(() => <ImportResult>{ rowsAffected: this.rowsAffected }),
    );
  }

  protected getItem(row: Product, companyId: string, user: User, key: string): GateItem {
    return <any>{
      key,
      id: Guid.create().toString(),
      createdById: user && user.id,
      createdOn: new Date(),
      modifiedById: user && user.id,
      modifiedOn: new Date(),
      extCode: row.id,
      available: +row.active === 1 && +(row.stock && row.stock.quantity) > 0,
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

  protected getPhpDate(date: Date): string {
    return date && date.toISOString().replace('T', ' ').substr(0, 19) || '';
  }
}
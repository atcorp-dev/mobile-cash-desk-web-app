import { Company } from './../../companies/company.model';
import { Observable, from } from 'rxjs';
import { IntegrationService } from './../integration.service';
import { Injectable, Inject, HttpService } from "@nestjs/common";
import { Item, AdditionalField } from '../../inventory/item.model';
import { map, catchError, switchMap } from 'rxjs/operators';
import { User } from '../../user/user.model';

export class PrestaShopIntegrationConfig {
  domain: string;
  type: string;
  authToken: string;
}

@Injectable()
export class PrestaShopIntegrationService implements IntegrationService {

  protected config: PrestaShopIntegrationConfig

  constructor(
    private readonly httpService: HttpService,
    @Inject('ItemRepository') private readonly itemRepository: typeof Item
    ) {}

  protected get uri() {
    const { domain, type } = this.config;
    return `${type}://${domain}/api`;
  }

  public importItems(args: {company: Company, user?: User}): Observable<Item[]> {
    const { company, user } = args;
    const companyId = company.id;
    this.config = company.extras && company.extras.integrationConfig && company.extras.integrationConfig.config;
    const display = '[id,reference,quantity,price,active,meta_title,name,description]'
    const config = {
      headers: {
        authorization: `Basic ${this.config.authToken}`
      },
      params: {
        'output_format': 'JSON',
        display
      }
    }
    return this.httpService.get(`${this.uri}/products`, config)
    .pipe(
      map((res: any) => {
        if (res && res.data && res.data.products) {
          return res.data.products.map(x => <Item>{
            createdById: user && user.id,
            modifiedById: user && user.id,
            extCode: x.id,
            available: +x.active === 1,
            code: x.reference,
            companyId,
            name: x.name[0].value,
            price: +x.price || null,
            additionalFields: this.getAdditionalFields(x),
            source: x
          });
        }
        return [];
      }),
      switchMap(items => {
        return from(
          this.itemRepository.sequelize.transaction()
        ).pipe(
          switchMap(
            transaction =>  this.itemRepository.destroy({ where: { companyId } })
             .then(() => Promise.resolve(transaction))
          ),
          switchMap(
            transaction => from(
              this.itemRepository.bulkCreate(items, { individualHooks: true })
              .then(
                records => transaction.commit()
                  .then(() => Promise.resolve(records))
              )
            )
          )
        )
      })
    );
  }

  protected getAdditionalFields(row): any {
    const description: string = row.description && row.description && row.description[0].value;
    if (description) {
      return [<AdditionalField>{ name: '', value: description }];
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
}
import { Observable } from 'rxjs';
import { IntegrationService } from './../integration.service';
import { Injectable, Inject, HttpService } from "@nestjs/common";
import { Item } from '../../inventory/item.model';
import { map, catchError } from 'rxjs/operators';

export class PrestaShopIntegrationConfig {
  domain: string;
  type: string;
  authToken: string;
}

@Injectable()
export class PrestaShopIntegrationService implements IntegrationService {

  constructor(
    @Inject('PrestaShopIntegrationConfig') private readonly config: typeof PrestaShopIntegrationConfig,
    private readonly httpService: HttpService

  ) {}

  protected get uri() {
    const {domain, type, authToken} = <any>this.config;
    return `${type}://${domain}/api`;
  }

  public importItems(companyId: string): Observable<any> {
    const display = '[id,reference,quantity,price,active,meta_title,name]'
    const config = {
      headers: {
        authorization: `Basic ${(<any>this.config).authToken}`
      },
      params: {
        'output_format': 'JSON',
        display
      }
    }
    return this.httpService.get(`${this.uri}/products`, config);
    /*.pipe(
      map((res: any) => {
        if (res && res.data && res.data.products) {
          return res.map(x => <Item>{
            extCode: x.id,
            available: +x.active === 1,
            code: x.reference,
            companyId,
            name: x.name[0].value,
            additionalFields: x
          });
        }
      }),
      catchError(err => {
        throw err;
      })
    );*/
  }
}
import { Item } from './../../item/models/item.model';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { DataService } from './../../core/services/data.service';

@Injectable()
export class CompanyDataService extends DataService {
  apiPath = 'api/companies';

  createItem(item: Item): Observable<any> {
    const url = `${this.apiPath}/${item.companyId}/items`;
    return this.httpClient.post(url, item);
  }
}

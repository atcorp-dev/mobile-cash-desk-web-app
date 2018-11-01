import { Observable } from 'rxjs';
import { Item } from './../models/item.model';
import { Injectable } from '@angular/core';
import { DataService } from '../../core/services/data.service';

@Injectable()
export class ItemDataService extends DataService {
  apiPath = 'api/items';

  modifyItem(id: string, item: Item): Observable<any> {
    const url = `${this.apiPath}/${id}`;
    return this.httpClient.patch(url, item);
  }
}

import { Observable } from 'rxjs';
import { Item } from '../inventory/item.model';

export interface IntegrationService {
  importItems(config: any): Observable<Item[]>;
}

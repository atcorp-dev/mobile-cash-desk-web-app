import { Observable } from 'rxjs';
import { Item } from '../inventory/item.model';

export interface IntegrationService {
  importItems(companyId: string): Observable<Item[]>;
}

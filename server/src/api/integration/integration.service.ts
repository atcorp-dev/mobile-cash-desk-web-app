import { Observable } from 'rxjs';
import { Item } from '../inventory/item.model';

export class ImportResult {
  rowsInserted: number;
  rowsUpdated: number;
}
export interface IntegrationService {
  importItems(config: any): Observable<ImportResult>;
}

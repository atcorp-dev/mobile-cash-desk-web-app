import { Observable } from 'rxjs';
import { Item } from '../inventory/item.model';

export class ImportResult {
  rowsAffected: number;
}
export interface IntegrationService {
  importItems(config: any): Observable<ImportResult>;
}

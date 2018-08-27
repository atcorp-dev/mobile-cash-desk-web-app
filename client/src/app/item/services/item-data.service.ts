import { Injectable } from '@angular/core';
import { DataService } from '../../core/services/data.service';

@Injectable()
export class ItemDataService extends DataService {
  apiPath = 'api/items';
}

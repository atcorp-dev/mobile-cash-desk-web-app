import { Injectable } from '@angular/core';
import { DataService } from './../../core/services/data.service';

@Injectable()
export class CompanyDataService extends DataService {
  apiPath = 'api/companies';
}

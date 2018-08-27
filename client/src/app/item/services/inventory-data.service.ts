import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { DataService } from '../../core/services/data.service';

@Injectable()
export class InventoryDataService extends DataService {
  apiPath = 'api/inventory';

  importCsv(companyCode: string, file: File): Observable<any> {
    const url = `${this.apiPath}/${companyCode}/importFromCsv`;
    const formData = new FormData;
    formData.append('file', file, file.name);
    const headers = new Headers();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    const options: any = { headers: headers };
    return this.httpClient.post(url, formData, options);
  }
}

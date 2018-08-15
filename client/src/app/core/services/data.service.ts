import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class DataService {
  constructor(protected httpClient: HttpClient) {}

  public get<T>(c: new () => T): Observable<T[]> {
    return this.httpClient.get('api/companies')
    .pipe(
      map((res: any[]) => res.map(
        e => Object.assign(this.createInstance(c), e)
      ))
    );
  }

  public post(body): Observable<any> {
    return this.httpClient.post('api/companies', body);
  }

  protected createInstance<T>(c: new () => T): T {
    return new c();
  }
}

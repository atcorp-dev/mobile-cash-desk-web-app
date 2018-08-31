import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export abstract class DataService {
  abstract apiPath: string;

  constructor(protected httpClient: HttpClient) {}

  public get<T>(c: new () => T, filter?): Observable<T[]> {
    return this.httpClient.get(this.apiPath, { params: filter })
    .pipe(
      map((res: any[]) => res.map(
        e => Object.assign(this.createInstance(c), e)
      ))
    );
  }

  public post(body): Observable<any> {
    return this.httpClient.post(this.apiPath, body);
  }

  public delete(id): Observable<any> {
    const parts = this.apiPath.split('/');
    parts.push(id);
    const url = parts.join('/');
    return this.httpClient.delete(url);
  }

  protected createInstance<T>(c: new () => T): T {
    return new c();
  }
}

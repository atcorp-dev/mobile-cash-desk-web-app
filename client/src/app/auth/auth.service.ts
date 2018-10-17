import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';

@Injectable()
export class AuthService {

  private username: string;
  private password: string;
  private user: any;

  constructor(private http: HttpClient) {}

  public getToken(): string {
    // return btoa(JSON.stringify({ username: this.username, password: this.password }));
    return null;
  }

  public authorize(username: string, password: string): Observable<any> {
    this.username = username;
    this.password = password;
    return this.getCurrentUser();
  }

  public logOut(): Observable<any> {
    return this.http.post('/api/auth/logout', {}).pipe(tap(res => {
      this.username = null;
      this.password = null;
      this.user = null;
    }));
  }

  public getCurrentUser(): Observable<any> {
    return Observable.create(observer => {
      if (this.user) {
        return observer.next(this.user);
      }
      this.http.post('/api/auth/login', { username: this.username, password: this.password })
      .subscribe(user => {
        this.user = user;
        observer.next(user);
      });
    });
  }
}

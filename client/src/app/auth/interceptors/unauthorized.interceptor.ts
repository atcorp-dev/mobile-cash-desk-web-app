import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpResponse
} from '@angular/common/http';
import { AuthService } from './../auth.service';
import { tap } from 'rxjs/operators';

@Injectable()
export class UnauthorizedInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService, private router: Router) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(tap(
      event => this.handleResponse(event),
      err => this.handleException(err)
    ));
  }

  handleResponse(event: HttpEvent<any>) {
    if (event instanceof HttpResponse) {
      // do stuff with response if you want
    }
  }

  handleException(err: any) {
    if (err instanceof HttpErrorResponse) {
      if (err.status === 401) {
        // redirect to the login route
        // or show a modal
        this.router.navigate(['login']);
      }
    }
  }
}

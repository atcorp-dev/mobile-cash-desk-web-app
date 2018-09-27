import { AppCoreModule } from './../core/app-core.module';
import { UnauthorizedInterceptor } from './interceptors/unauthorized.interceptor';
import { AuthService } from './auth.service';
import { BearerInterceptor } from './interceptors/bearer.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { LoginDialogComponent } from './components/login-dialog/login-dialog.component';
import { LoginPageComponent } from './components/login-page/login-page.component';

@NgModule({
  imports: [
    AppCoreModule
  ],
  providers: [
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BearerInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UnauthorizedInterceptor,
      multi: true
    }
  ],
  declarations: [LoginDialogComponent, LoginPageComponent],
  exports: [LoginDialogComponent, LoginPageComponent],
  entryComponents: [LoginDialogComponent]
})
export class AuthModule { }

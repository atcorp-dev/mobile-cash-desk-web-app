import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ItemModule } from './item/item.module';
import { CompanyModule } from './company/company.module';
import { AppRoutes } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from './angular-material.module';
import { AppCommonModule } from 'src/app/common/common.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    AppCommonModule,
    AuthModule,
    AppRoutes,
    CompanyModule,
    ItemModule,
  ],
  providers: [AppService],
  bootstrap: [AppComponent]
})
export class AppModule {}

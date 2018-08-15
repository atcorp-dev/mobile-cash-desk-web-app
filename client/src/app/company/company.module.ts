import { AppCoreModule } from './../core/app-core.module';
import { NgModule } from '@angular/core';
import { CompanyListComponent } from './components/company-list/company-list.component';
import { CompanyPageComponent } from './components/company-page/company-page.component';

@NgModule({
  imports: [
    AppCoreModule
  ],
  declarations: [
    CompanyListComponent,
    CompanyPageComponent
  ],
  exports: [
    CompanyListComponent,
    CompanyPageComponent
  ]
})
export class CompanyModule { }

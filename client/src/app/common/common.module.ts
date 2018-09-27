import { MainPageComponent } from './components/main-page/main-page.component';
import { AppCoreModule } from './../core/app-core.module';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [
    AppCoreModule
  ],
  declarations: [
    MainPageComponent
  ],
  exports: [
    MainPageComponent
  ]
})
export class AppCommonModule { }

import { NgModule } from '@angular/core';
import { AppCoreModule } from './../core/app-core.module';
import { ItemPageComponent } from './components/item-page/item-page.component';
import { ItemListComponent } from './components/item-list/item-list.component';
@NgModule({
  imports: [
    AppCoreModule
  ],
  declarations: [
    ItemPageComponent,
    ItemListComponent
  ],
  exports: [
    ItemPageComponent,
    ItemListComponent
  ]
})
export class ItemModule { }

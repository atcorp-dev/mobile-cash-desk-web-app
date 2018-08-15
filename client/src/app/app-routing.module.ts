import { CompanyPageComponent } from './company/components/company-page/company-page.component';
import { CompanyListComponent } from './company/components/company-list/company-list.component';
import { ItemPageComponent } from './item/components/item-page/item-page.component';
import { ItemListComponent } from './item/components/item-list/item-list.component';
import { AppComponent } from './app.component';
import { Routes, RouterModule } from '@angular/router';

const appRoutes: Routes = [
  { path: '', component: ItemListComponent, pathMatch: 'full' },
  { path: 'item-list', component: ItemListComponent, pathMatch: 'full' },
  { path: 'item/:id', component: ItemPageComponent, pathMatch: 'full' },
  { path: 'company-list', component: CompanyListComponent, pathMatch: 'full' },
  { path: 'company/:id', component: CompanyPageComponent, pathMatch: 'full' },
  { path: '**', component: ItemListComponent, pathMatch: 'full' },
];
export const AppRoutes = RouterModule.forRoot(appRoutes, {
  useHash: true
});

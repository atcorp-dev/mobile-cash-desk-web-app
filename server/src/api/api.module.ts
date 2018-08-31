import { CategoryModule } from './categories/category.module';
import { InventoryModule } from './inventory/inventory.module';
import { Module } from '@nestjs/common';
import { CompanyModule } from './companies/company.module';
import { Routes, RouterModule, Route } from 'nest-router'

const modules = [
  CategoryModule,
  InventoryModule,
  CompanyModule,
]

const routes: Routes = modules.map(module => <Route>{
  path: 'api',
  module
});

@Module({
  imports: [
    RouterModule.forRoutes(routes),
    ...modules
  ],
  exports: [
    CompanyModule,
    InventoryModule
  ],
})
export class ApiModule { }

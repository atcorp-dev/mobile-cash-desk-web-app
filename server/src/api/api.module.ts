import { CartModule } from './cart/cart.module';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './categories/category.module';
import { InventoryModule } from './inventory/inventory.module';
import { Module } from '@nestjs/common';
import { CompanyModule } from './companies/company.module';
import { Routes, RouterModule, Route } from 'nest-router'
import { UserModule } from './user/user.module';

const modules = [
  UserModule,
  AuthModule,
  CategoryModule,
  InventoryModule,
  CompanyModule,
  CartModule
]

const routes: Routes = modules.map(module => <Route>{
  path: 'api',
  module
});

@Module({
  imports: [
    RouterModule.forRoutes(routes),
    AuthModule,
    ...modules
  ],
  exports: [
    CompanyModule,
    InventoryModule,
    UserModule,
    CartModule
  ],
})
export class ApiModule { }

import { InventoryModule } from './inventory/inventory.module';
import { Module } from '@nestjs/common';
import { CompanyModule } from './companies/company.module';
import { Routes, RouterModule } from 'nest-router'

const routes: Routes = [
  {
    path: 'api',
    module: CompanyModule
  },
  {
    path: 'api',
    module: InventoryModule
  },
];

@Module({
  imports: [
    RouterModule.forRoutes(routes),
    CompanyModule,
    InventoryModule
  ],
  exports: [
    CompanyModule,
    InventoryModule
  ],
})
export class ApiModule { }

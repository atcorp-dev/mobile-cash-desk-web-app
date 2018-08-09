import { InventoryModule } from './inventory/inventory.module';
import { Module } from '@nestjs/common';
import { CompanyModule } from './companies/company.module';

@Module({
  imports: [
    CompanyModule,
    InventoryModule
  ],
  exports: [
    CompanyModule,
    InventoryModule
  ],
})
export class ApiModule { }

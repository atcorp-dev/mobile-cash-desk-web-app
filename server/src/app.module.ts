import { InventoryModule } from './inventory/inventory.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { CompanyModule } from './companies/company.module';

@Module({
  imports: [
    CompanyModule,
    InventoryModule
  ],
  controllers: [AppController],
  providers: [],
})
export class ApplicationModule {}

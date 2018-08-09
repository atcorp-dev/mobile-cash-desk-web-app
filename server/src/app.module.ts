import { InventoryModule } from './inventory/inventory.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ContragentModule } from './contragents/contragent.module';

@Module({
  imports: [
    ContragentModule,
    InventoryModule
  ],
  controllers: [AppController],
  providers: [],
})
export class ApplicationModule {}

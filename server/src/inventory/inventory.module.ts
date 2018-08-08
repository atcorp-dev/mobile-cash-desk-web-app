import { inventoryProviders } from './inventory.provider';
import { InventoryController } from './inventory.controller';
import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { InventoryService } from './inventory.service';

@Module({
  imports: [DatabaseModule],
  controllers: [InventoryController],
  providers: [
    InventoryService,
    ...inventoryProviders
  ]
})
export class InventoryModule { }

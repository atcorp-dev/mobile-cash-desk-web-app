import { IntegrationModule } from './../integration/integration.module';
import { ItemController } from './items.controller';
import { DatabaseModule } from './../../database/database.module';
import { inventoryProviders } from './inventory.provider';
import { InventoryController } from './inventory.controller';
import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { ItemService } from './item.service';

@Module({
  imports: [
    DatabaseModule,
    IntegrationModule
  ],
  controllers: [
    InventoryController,
    ItemController
  ],
  providers: [
    InventoryService,
    ItemService,
    ...inventoryProviders
  ]
})
export class InventoryModule { }

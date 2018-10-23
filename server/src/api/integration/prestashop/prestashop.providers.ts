import { GateItem } from './../../inventory/gate-item.model';
import { Item } from './../../inventory/item.model';
import { PrestaShopIntegrationService } from './prestashop.service';
import { Provider } from '@nestjs/common';

export const prestaShopProviders = [
  {
    provide: 'ItemRepository',
    useValue: Item
  },
  {
    provide: 'GateItemRepository',
    useValue: GateItem
  },
  PrestaShopIntegrationService,
  <Provider>{
    provide: 'PrestaShopIntegrationService',
    useClass: PrestaShopIntegrationService
  }
];
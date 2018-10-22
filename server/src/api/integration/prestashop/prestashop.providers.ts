import { Item } from './../../inventory/item.model';
import { PrestaShopIntegrationService } from './prestashop.service';
import { Provider } from '@nestjs/common';

export const prestaShopProviders = [
  {
    provide: 'ItemRepository',
    useValue: Item
  },
  PrestaShopIntegrationService,
  <Provider>{
    provide: 'PrestaShopIntegrationService',
    useClass: PrestaShopIntegrationService
  }
];
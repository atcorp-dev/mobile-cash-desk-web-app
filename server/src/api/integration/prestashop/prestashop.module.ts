import { prestaShopProviders } from './prestashop.providers';
import { PrestaShopIntegrationService } from './prestashop.service';
import { Module, HttpModule } from "@nestjs/common";

@Module({
  imports: [
    HttpModule
  ],
  exports: [
    PrestaShopIntegrationService
  ],
  providers: [
    ...prestaShopProviders
  ]
})
export class PrestaShopIntegrationModule { }
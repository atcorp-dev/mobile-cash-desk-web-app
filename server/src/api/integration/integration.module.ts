import { Module } from "@nestjs/common";
import { PrestaShopIntegrationModule } from "./prestashop/prestashop.module";

@Module({
  imports: [
    PrestaShopIntegrationModule
  ],
  exports: [
    PrestaShopIntegrationModule
  ],
})
export class IntegrationModule { }
import { CompanyService } from './company.service';
import { Module } from '@nestjs/common';
import { CompanyController } from './company.controller';
import { companyProviders } from './company.provider';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [CompanyController],
  providers: [
    CompanyService,
    ...companyProviders
  ]
})
export class CompanyModule {}

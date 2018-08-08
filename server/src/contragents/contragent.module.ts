import { ContragentService } from './contragent.service';
import { Module } from '@nestjs/common';
import { ContragentController } from './contragent.controller';
import { contragentProviders } from './contragent.provider';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ContragentController],
  providers: [
    ContragentService,
    ...contragentProviders
  ]
})
export class ContragentModule {}

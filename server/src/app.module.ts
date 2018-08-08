import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ContragentModule } from './contragents/contragent.module';

@Module({
  imports: [
    ContragentModule
  ],
  controllers: [AppController],
  providers: [],
})
export class ApplicationModule {}

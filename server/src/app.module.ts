import { AppService } from './app.service';
import { ApiModule } from './api/api.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';

@Module({
  imports: [
    ApiModule
  ],
  controllers: [AppController],
  providers: []
})
export class ApplicationModule {}

import { HttpModule } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { transactionProviders } from './transaction.provider';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [
    DatabaseModule,
    HttpModule
  ],
  controllers: [TransactionController],
  providers: [
    TransactionService,
    ...transactionProviders
  ]
})
export class TransactionModule { }

import { Transaction } from './transaction.model';

export const transactionProviders = [
  {
    provide: 'TransactionRepository',
    useValue: Transaction
  }
];

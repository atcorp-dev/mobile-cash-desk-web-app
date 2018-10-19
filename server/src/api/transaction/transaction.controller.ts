import { TransactionService } from './transaction.service';
import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger';
import { Controller, UseGuards, Get, Query, Req, Patch, Param, Post, Body } from '@nestjs/common';
import { AppAuthGuard } from '../auth/auth.guard';
import { Observable } from 'rxjs';
import { Transaction } from './transaction.model';
import { CreateTransactionDto } from './create-transaction.dto';

@ApiUseTags('Transactions')
@ApiBearerAuth()
@Controller('transactions')
@UseGuards(AppAuthGuard)
export class TransactionController {

  constructor(private transactionService: TransactionService) { }

  @Get()
  getAll(@Query('page') page: number, @Req() req): Observable<Array<Transaction>> {
    return this.transactionService.getAll(page, req.user);
  }

  @Post(':companyId')
  create(@Param('companyId') companyId: string, @Body() createTransactionDto: CreateTransactionDto): Observable<Transaction> {
    return this.transactionService.create(companyId, createTransactionDto);
  }

  @Patch(':id/markAsPayed')
  markAsPayed(@Param('id') id: string): Observable<Transaction> {
    return this.transactionService.markAsPayed(id);
  }

  @Patch(':id/markAsRejected')
  markAsRejected(@Param('id') id: string): Observable<Transaction> {
    return this.transactionService.markAsRejected(id);
  }
}

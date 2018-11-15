import { UserRole, User } from './../user/user.model';
import { ReqUser } from './../user/user.decorator';
import { TransactionService } from './transaction.service';
import { ApiUseTags, ApiBearerAuth, ApiImplicitQuery, ApiOperation } from '@nestjs/swagger';
import { Controller, UseGuards, Get, Query, Req, Patch, Param, Post, Body, ForbiddenException, BadRequestException, Res, HttpStatus } from '@nestjs/common';
import { AppAuthGuard } from '../auth/auth.guard';
import { Observable } from 'rxjs';
import { Transaction } from './transaction.model';
import { CreateTransactionDto } from './create-transaction.dto';
import { catchError, map } from 'rxjs/operators';

@ApiUseTags('Transactions')
@ApiBearerAuth()
@Controller('transactions')
@UseGuards(AppAuthGuard)
export class TransactionController {

  constructor(private transactionService: TransactionService) { }

  @Get()
  @ApiOperation({
    title: 'Get all transactions',
    description: 'To be able call this method current user must be admin'
  })
  @ApiImplicitQuery({ name: 'page', required: false })
  getAll(@Query('page') page: number, @ReqUser() user): Observable<Array<Transaction>> {
    if (!user || user.role !== UserRole.Admin) {
      throw new ForbiddenException('Not enough permission');
    }
    return this.transactionService.getAll(page, user);
  }

  @Get(':id')
  @ApiOperation({
    title: 'Get transaction',
    description: 'Get Transaction by his id'
  })
  getById(@Param('id') id: string): Observable<Transaction> {
    if (!id) {
      throw new BadRequestException('Id can not be null');
    }
    return this.transactionService.getById(id);
  }

  @Post(':companyId')
  @ApiOperation({
    title: 'Create transaction',
    description: `This method for Mobile App
    This method uses when transaction type is [Cash]
    After call this method will be provide info to company server to create cart etc.
    Response from company server expect cart identity or token.
    This id or token will be printed out for customer
    `
  })
  create(@Param('companyId') companyId: string, @Body() createTransactionDto: CreateTransactionDto, @Res() res, @ReqUser() user: User) {
    return this.transactionService.create(companyId, createTransactionDto, user)
      .pipe(
        catchError(err => {
          console.dir(err);
          console.error(err);
          throw new BadRequestException(err.message);
        })
      )
      .subscribe(
        result => res.status(HttpStatus.OK).send(result)
      );
  }

  @Patch(':id/markAsPayed')
  @ApiOperation({
    title: 'Mark transaction as payed',
    description: `This method for Mobile App
    After call this method will be provide info to company server to create order etc
    `
  })
  markAsPayed(@Param('id') id: string, @Res() res, @ReqUser() user: User) {
    return this.transactionService.markAsPayed(id, user)
    .pipe(
      catchError(err => {
        console.dir(err);
        console.error(err);
        throw new BadRequestException(err.message);
      })
    )
      .subscribe(
        result => res.status(HttpStatus.OK).send(result)
      );
  }

  @Patch(':id/markAsRejected')
  @ApiOperation({
    title: 'Reject transaction',
    description: `This method for Mobile App
    After call this method wil be provide info to company server to cancel cart etc`
  })
  markAsRejected(@Param('id') id: string, @Res() res, @ReqUser() user: User) {
    return this.transactionService.markAsRejected(id, user)
      .pipe(
        catchError(err => {
          console.dir(err);
          console.error(err);
          throw new BadRequestException(err.message);
        })
      )
      .subscribe(
        result => res.status(HttpStatus.OK).send(result)
      );
  }
}

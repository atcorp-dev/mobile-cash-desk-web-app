import { ParseBooleanPipe } from './../pipes/boolean.pipe';
import { OutputTransactionDto } from './dto/output-transaction.dto';
import { CompanyIdPipe } from './../pipes/company-id.pipe';
import { ParseDatePipe } from './../pipes/date.pipe';
import { UserRole, User } from './../user/user.model';
import { ReqUser } from './../user/user.decorator';
import { TransactionService } from './transaction.service';
import { ApiUseTags, ApiBearerAuth, ApiImplicitQuery, ApiOperation } from '@nestjs/swagger';
import { Controller, UseGuards, Get, Query, Patch, Param, Post, Body, ForbiddenException, BadRequestException, Res, HttpStatus, Logger } from '@nestjs/common';
import { AppAuthGuard } from '../auth/auth.guard';
import { Observable } from 'rxjs';
import { Transaction } from './transaction.model';
import { NotifyTransactionDto } from './dto/notify-transaction.dto';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { catchError } from 'rxjs/operators';

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

  @Get(':companyId/pending')
  @ApiOperation({
    title: 'Get all pending transactions'
  })
  getAllPending(@Param('companyId', new CompanyIdPipe()) companyId: string): Observable<Array<OutputTransactionDto>> {
    return this.transactionService.getAllPending(companyId);
  }

  @Get(':companyId/payed')
  @ApiOperation({
    title: 'Get all payed transactions'
  })
  @ApiImplicitQuery({ name: 'dateFrom', required: false, type: 'string' })
  @ApiImplicitQuery({ name: 'dateTo', required: false, type: 'string' })
  getAllPayed(
    @Param('companyId', new CompanyIdPipe()) companyId: string,
    @Query('dateFrom', new ParseDatePipe(false)) dateFrom: Date,
    @Query('dateTo', new ParseDatePipe(false)) dateTo: Date,
    @Query('sort') sort: string,
    @Query('direction') direction: string,
    @Query('showReceipt', new ParseBooleanPipe()) showReceipt: boolean
  ): Observable<Array<OutputTransactionDto>> {
    const opts = {sort, direction, showReceipt };
    return this.transactionService.getAllPayed(companyId, dateFrom, dateTo, opts).pipe(
      catchError(err => {
        console.error(err);
        throw new BadRequestException(err.message);
      })
    );
  }

  @Get(':companyId/rejected')
  @ApiOperation({
    title: 'Get all rejected transactions'
  })
  getAllRejected(@Param('companyId', new CompanyIdPipe()) companyId: string): Observable<Array<OutputTransactionDto>> {
    return this.transactionService.getAllRejected(companyId);
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
  create(@Param('companyId', new CompanyIdPipe()) companyId: string, @Body() createTransactionDto: CreateTransactionDto, @Res() res, @ReqUser() user: User) {
    return this.transactionService.create(companyId, createTransactionDto, user)
      /*.pipe(
        catchError(err => {
          console.dir(err);
          console.error(err);
          throw new BadRequestException(err.message);
        })
      )*/
      .subscribe(
        result => res.status(HttpStatus.OK).send(result),
        err => res.status(HttpStatus.BAD_REQUEST).send(err.message)
      );
  }

  @Patch(':id/markAsPayed')
  @ApiOperation({
    title: 'Mark transaction as payed',
    description: `This method for Mobile App
    After call this method will be provide info to company server to create order etc
    `
  })
  markAsPayed(@Param('id') id: string, @Res() res, @Body() payload, @ReqUser() user: User) {
    return this.transactionService.markAsPayed(id, user, payload)
    /*.pipe(
      catchError(err => {
        console.dir(err);
        console.error(err);
        throw new BadRequestException(err.message);
      })
    )*/
      .subscribe(
        result => res.status(HttpStatus.OK).send(result),
        err => res.status(HttpStatus.BAD_REQUEST).send(err.message)
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
      /*.pipe(
        catchError(err => {
          console.dir(err);
          console.error(err);
          throw new BadRequestException(err.message);
        })
      )*/
      .subscribe(
        result => res.status(HttpStatus.OK).send(result),
        err => res.status(HttpStatus.BAD_REQUEST).send(err.message)
      );
  }

  @Post(':id/notify')
  @ApiOperation({
    title: 'Notify',
    description: ``
  })
  @ApiImplicitQuery({ name: 'showPush', required: false, enum: ['Y'] })
  notify(@Param('id') id: string, @Body() message: NotifyTransactionDto, @Res() res, @ReqUser() user: User, @Query('showPush') showPush) {
    Logger.log(JSON.stringify(message), `${res.req!.url}`, true);
    return this.transactionService.notify(id, message, user, showPush === 'Y')
      .subscribe(
        result => res.status(HttpStatus.OK).send(result),
        err => {
          console.dir(err);
          console.error(err);
          //new BadRequestException(err.message);
          res.status(HttpStatus.BAD_REQUEST).send(err.message);
        }
    );
  }
}

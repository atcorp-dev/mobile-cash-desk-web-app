import { AppAuthGuard } from './../auth/auth.guard';
import { Observable } from 'rxjs';
import { CartService } from './cart.service';
import { Controller, Get, Post, Param, Body, UseGuards, Patch, Query } from '@nestjs/common';
import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger';
import { Cart } from './cart.model';
import { CartDto } from './cart.dto';
import { CompanyIdPipe } from '../pipes/company-id.pipe';
import { ParseDatePipe } from '../pipes/date.pipe';
import { SessionUser } from '../user/user.decorator';
import { User } from '../user/user.model';

@ApiUseTags('Carts')
@ApiBearerAuth()
@Controller('carts')
@UseGuards(AppAuthGuard)
export class CartController {

  constructor(private cartService: CartService) { }

  @Get()
  getAll(
    @Query('companyId', new CompanyIdPipe()) companyId: string,
    @Query('dateFrom', new ParseDatePipe(false)) dateFrom: Date,
    @Query('dateTo', new ParseDatePipe(false)) dateTo: Date,
    @Query('sort') sort: string,
    @Query('direction') direction: string,
  ): Observable<Array<Cart>> {
    const opts = { sort, direction };
    return this.cartService.getAll(companyId, dateFrom, dateTo, opts);
  }

  @Get(':id')
  getById(@Param('id') id: string): Observable<Cart> {
    return this.cartService.getById(id);
  }

  @Post()
  create(@Body() createCart: CartDto, @SessionUser() user: User): Observable<any> {
    return this.cartService.create(createCart, user);
  }

  @Patch(':id')
  modify(@Param('id') id: string, @Body() cart: CartDto, @SessionUser() user: User): Observable<any> {
    return this.cartService.modify(id, cart, user);
  } h

}
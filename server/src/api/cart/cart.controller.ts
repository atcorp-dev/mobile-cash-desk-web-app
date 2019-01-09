import { AppAuthGuard } from './../auth/auth.guard';
import { Observable } from 'rxjs';
import { CartService } from './cart.service';
import { Controller, Get, Post, Param, Body, UseGuards, Patch } from '@nestjs/common';
import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger';
import { Cart } from './cart.model';
import { CartDto } from './cart.dto';

@ApiUseTags('Categories (not implemented)')
@ApiBearerAuth()
@Controller('categories')
@UseGuards(AppAuthGuard)
export class CartController {

  constructor(private cartService: CartService) { }

  @Get()
  getAll(): Observable<Array<Cart>> {
    return this.cartService.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: string): Observable<Cart> {
    return this.cartService.getById(id);
  }

  @Post()
  create(@Body() createCart: CartDto): Observable<any> {
    return this.cartService.create(createCart);
  }

  @Patch(':id')
  modify(@Param('id') id: string, @Body() cart: CartDto): Observable<any> {
    return this.cartService.modify(id, cart);
  }

}
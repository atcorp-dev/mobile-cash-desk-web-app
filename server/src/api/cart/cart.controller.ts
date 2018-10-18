import { CartService } from './cart.service';
import { ApiUseTags, ApiBearerAuth } from "@nestjs/swagger";
import { Controller, UseGuards, Get, Query, Req, Patch, Param, Post, Body } from "@nestjs/common";
import { AppAuthGuard } from "../auth/auth.guard";
import { Observable } from "rxjs";
import { Cart } from "./cart.model";
import { create } from 'domain';
import { CreateCartDto } from './create-cart.dto';

@ApiUseTags('Carts')
@ApiBearerAuth()
@Controller('carts')
@UseGuards(AppAuthGuard)
export class CartController {

  constructor(private cartService: CartService) { }

  @Get()
  getAll(@Query('page') page: number, @Req() req): Observable<Array<Cart>> {
    return this.cartService.getAll(page, req.user);
  }

  @Post(':companyId')
  create(@Param('companyId') companyId: string, @Body() createCartDto: CreateCartDto): Observable<Cart> {
    return this.cartService.create(companyId, createCartDto);
  }

  @Patch(':id/markAsPayed')
  markAsPayed(@Param('id') id: string): Observable<Cart> {
    return this.cartService.markAsPayed(id);
  }

  @Patch(':id/markAsRejected')
  markAsRejected(@Param('id') id: string): Observable<Cart> {
    return this.cartService.markAsRejected(id);
  }
}

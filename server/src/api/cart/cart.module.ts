import { CartService } from './cart.service';
import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { cartProviders } from './cart.provider';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [CartController],
  providers: [
    CartService,
    ...cartProviders
  ]
})
export class CartModule { }

import { CartItemDto } from './cart-item.dto';
import { PaymentType } from './cart.model';
import { ApiModelProperty } from '@nestjs/swagger';

export class CreateCartDto {

  @ApiModelProperty({ enum: [0, 1]})
  type: PaymentType;

  @ApiModelProperty({ required: false})
  dateTime?: string;

  @ApiModelProperty()
  ownerId: string;

  @ApiModelProperty({ required: true, type: CartItemDto, isArray: true })
  itemList: Array<CartItemDto>
}
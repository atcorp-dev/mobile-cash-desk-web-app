import { TransactionItemDto } from './transaction-item.dto';
import { PaymentType } from '../transaction.model';
import { ApiModelProperty } from '@nestjs/swagger';

export class CreateTransactionDto {

  @ApiModelProperty()
  cartId: string

  @ApiModelProperty({ enum: [0, 1]})
  type: PaymentType;

  @ApiModelProperty({ required: false})
  dateTime?: string;

  @ApiModelProperty()
  ownerId: string;

  @ApiModelProperty({ required: true, type: TransactionItemDto, isArray: true })
  itemList: Array<TransactionItemDto>;

  @ApiModelProperty()
  totalPrice: number;

  @ApiModelProperty()
  extras: any;
}
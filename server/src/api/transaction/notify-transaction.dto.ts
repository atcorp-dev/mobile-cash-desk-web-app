import { ApiModelProperty } from '@nestjs/swagger';
import { TransactionItemDto } from './transaction-item.dto';

export class NotifyTransactionDto {
  @ApiModelProperty({ required: true, type: TransactionItemDto, isArray: true })
  itemList: Array<TransactionItemDto>;
}
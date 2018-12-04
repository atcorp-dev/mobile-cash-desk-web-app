import { TransactionItemDto } from './transaction-item.dto';
import { ApiModelProperty } from '@nestjs/swagger';

export class OutputTransactionDto {

  @ApiModelProperty()
  id: string

  @ApiModelProperty()
  userLogin: string;

  @ApiModelProperty()
  dateTime: Date;

  @ApiModelProperty()
  itemList: Array<TransactionItemDto>;

  @ApiModelProperty()
  clientInfo: string;

}
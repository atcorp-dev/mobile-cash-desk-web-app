import { TransactionStatus } from './../transaction.model';
import { TransactionItemDto } from './transaction-item.dto';
import { ApiModelProperty } from '@nestjs/swagger';

export class OutputTransactionDto {

  @ApiModelProperty()
  id: string;

  @ApiModelProperty()
  documentNumber: string;

  @ApiModelProperty()
  userLogin: string;

  @ApiModelProperty()
  totalPrice?: number;

  @ApiModelProperty()
  status?: TransactionStatus;

  @ApiModelProperty()
  dateTime: Date;

  @ApiModelProperty()
  itemList: Array<TransactionItemDto>;

  @ApiModelProperty()
  clientInfo: string;

}
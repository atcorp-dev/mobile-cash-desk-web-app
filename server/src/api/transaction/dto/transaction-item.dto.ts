import { ApiModelProperty } from '@nestjs/swagger';

export class TransactionItemDto {

  @ApiModelProperty()
  itemId: string;

  @ApiModelProperty()
  name: string;

  @ApiModelProperty()
  code: string;

  @ApiModelProperty()
  barCode: string;

  @ApiModelProperty()
  price: number;

  @ApiModelProperty()
  qty: number;
  
  @ApiModelProperty({ required: false })
  extras: any;
}

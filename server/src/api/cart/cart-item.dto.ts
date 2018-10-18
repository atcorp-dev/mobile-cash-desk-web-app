import { ApiModelProperty } from '@nestjs/swagger';

export class CartItemDto {

  @ApiModelProperty()
  itemId: string;

  @ApiModelProperty()
  name: string;

  @ApiModelProperty()
  code: string;

  @ApiModelProperty()
  barCode: string;

  @ApiModelProperty({ required: false })
  description: string;

  @ApiModelProperty()
  price: number;

}

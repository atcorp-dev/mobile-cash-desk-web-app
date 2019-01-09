import { Company } from './../companies/company.model';
import { ApiModelProperty } from '@nestjs/swagger';

export class CartItemDto {

  @ApiModelProperty()
  id: string;

  @ApiModelProperty()
  cartId: string;

  @ApiModelProperty()
  name: string;

  @ApiModelProperty()
  code: string;

  @ApiModelProperty()
  barCode: string;

  @ApiModelProperty()
  price: number;

  @ApiModelProperty()
  discount: number;

  @ApiModelProperty()
  qty: number;

  @ApiModelProperty()
  dateTime: Date;

  @ApiModelProperty({required: false})
  company?: Company;

  @ApiModelProperty()
  companyId: string;

  @ApiModelProperty({ required: false })
  image?: string;
}

export class CartDto {

  @ApiModelProperty()
  id: string;

  @ApiModelProperty({ required: false })
  type?: number;

  @ApiModelProperty()
  clientInfo: string;

  @ApiModelProperty()
  items: Array<CartItemDto>;

}

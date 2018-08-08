import { Guid } from 'guid-typescript';
import { ApiModelProperty } from '@nestjs/swagger';

export class CreateItemDto {

  @ApiModelProperty()
  name: string;

  @ApiModelProperty()
  code: string;

  @ApiModelProperty()
  description: string;

  @ApiModelProperty()
  price: number;
}

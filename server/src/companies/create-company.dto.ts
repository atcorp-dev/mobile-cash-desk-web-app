import { Guid } from 'guid-typescript';
import { ApiModelProperty } from '@nestjs/swagger';

export class CreateCompanyDto {

  @ApiModelProperty()
  name: string;

  @ApiModelProperty()
  code: string;

  @ApiModelProperty()
  email: string;

  @ApiModelProperty()
  phone: string;

  @ApiModelProperty()
  address: string;
}
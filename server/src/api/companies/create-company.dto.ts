import { CompanyType } from './company.model';
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

  @ApiModelProperty({ required: false})
  parentId: string;

  @ApiModelProperty({ enum: [ 0, 1 ] })
  type: CompanyType;

  @ApiModelProperty()
  active: boolean;
}
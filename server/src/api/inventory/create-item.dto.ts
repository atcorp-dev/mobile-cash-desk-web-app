import { Guid } from 'guid-typescript';
import { ApiModelProperty } from '@nestjs/swagger';

export class AdditionalFieldDto {
  @ApiModelProperty()
  name: string;

  @ApiModelProperty()
  value: string;
}

export class CreateItemDto {

  @ApiModelProperty()
  name: string;

  @ApiModelProperty()
  extCode: string;

  @ApiModelProperty()
  code: string;

  @ApiModelProperty()
  barCode: string;

  @ApiModelProperty({ required: false })
  description: string;

  @ApiModelProperty()
  price: number;

  @ApiModelProperty({ required: false })
  image: string;

  @ApiModelProperty({ required: false, type: AdditionalFieldDto, isArray: true  })
  additionalFields?: Array<AdditionalFieldDto>;

}

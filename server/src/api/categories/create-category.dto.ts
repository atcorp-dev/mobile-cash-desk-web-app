import { ApiModelProperty } from '@nestjs/swagger';

export class CreateCategoryDto {

  @ApiModelProperty()
  name: string;

  @ApiModelProperty()
  code: string;
}

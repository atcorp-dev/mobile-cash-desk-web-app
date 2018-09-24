import { ApiModelProperty } from "@nestjs/swagger";

export class UserDto {

  @ApiModelProperty()
  id: string;

  @ApiModelProperty()
  login: string;

  @ApiModelProperty()
  email: string;

  @ApiModelProperty({ required: false })
  role?: number;

  @ApiModelProperty({ required: false })
  companyId?: string;
}
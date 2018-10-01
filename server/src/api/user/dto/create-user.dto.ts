import { ApiModelProperty } from "@nestjs/swagger";

export class CreateUserDto {
  @ApiModelProperty()
  login: string;

  @ApiModelProperty()
  password: string;

  @ApiModelProperty()
  email: string;

  @ApiModelProperty({ required: false })
  role?: number;

  @ApiModelProperty({ required: false })
  companyId?: string;

}
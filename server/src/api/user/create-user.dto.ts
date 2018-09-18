import { ApiModelProperty } from "@nestjs/swagger";

export class CreateUserDto {
  @ApiModelProperty()
  login: string;

  @ApiModelProperty()
  password: string;

  @ApiModelProperty()
  email: string;

  @ApiModelProperty()
  role: number;
}
import { ApiModelProperty } from "@nestjs/swagger";

export class ChangeUserPasswordDto {

  @ApiModelProperty()
  username: string;

  @ApiModelProperty()
  password: string;

  @ApiModelProperty()
  newPassword: string;

}
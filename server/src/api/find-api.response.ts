import { ApiResponseModelProperty } from "@nestjs/swagger";
import { totalmem } from "os";

export class FindApiResponse<T> {

  @ApiResponseModelProperty({ type: 'number' })
  totalCount?: number;

  @ApiResponseModelProperty({ type: 'array'})
  rows: Array<T>;
}
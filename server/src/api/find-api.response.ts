import { ApiResponseModelProperty } from "@nestjs/swagger";

export class FindApiResponse<T> {

  @ApiResponseModelProperty({ type: 'number' })
  totalCount?: number;

  @ApiResponseModelProperty({ type: 'array'})
  rows: Array<T>;
}
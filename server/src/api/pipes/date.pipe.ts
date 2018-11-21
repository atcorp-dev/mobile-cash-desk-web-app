
import { PipeTransform, Injectable, ArgumentMetadata, HttpStatus, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseDatePipe implements PipeTransform<string, Date> {

  constructor(private required: boolean) {}

  transform(value: string, metadata: ArgumentMetadata): Date {
    const val = Date.parse(value);
    if (isNaN(val)) {
      if (this.required) {
        throw new BadRequestException('Validation failed [Not DateTime]');
      } else {
        return null;
      }
    }
    return new Date(val);
  }
}
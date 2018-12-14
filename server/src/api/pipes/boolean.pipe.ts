import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseBooleanPipe implements PipeTransform<string, boolean> {

  constructor() { }

  transform(value: string, metadata: ArgumentMetadata): boolean {
    const val = value && value.toLowerCase() === 'true';
    return Boolean(val);
  }
}
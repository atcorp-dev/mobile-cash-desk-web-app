import { AppService } from './../../app.service';
import { Guid } from 'guid-typescript';

import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class CompanyIdPipe implements PipeTransform<string, string> {

  transform(value: string, metadata: ArgumentMetadata): string {
    if (value && Guid.isGuid(value)) {
      return value as string;
    }
    const companyId = AppService.getCompanyId(value);
    if (companyId && Guid.isGuid(companyId)) {
      return companyId;
    }
    throw new BadRequestException(
      `Company ID [${value}] is not GUID or Company with code [${value}] not found`
    );
  }
}
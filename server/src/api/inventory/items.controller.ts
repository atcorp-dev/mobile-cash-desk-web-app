import { Item } from './item.model';
import { ItemService } from './item.service';
import { Observable } from 'rxjs';
import { ApiUseTags } from '@nestjs/swagger';
import { Controller, Get, Query } from '@nestjs/common';

@ApiUseTags('Items')
@Controller('items')
export class ItemController {

  constructor(private itemService: ItemService) { }

  @Get('')
  getAll(@Query('companyId') companyId: string): Observable<Item[]> {
    const where = companyId ? { companyId } : null;
    return this.itemService.getAll(where);
  }

}

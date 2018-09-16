import { Item } from './item.model';
import { ItemService } from './item.service';
import { Observable } from 'rxjs';
import { ApiUseTags } from '@nestjs/swagger';
import { Controller, Get, Query, Delete, Param } from '@nestjs/common';

@ApiUseTags('Items')
@Controller('items')
export class ItemController {

  constructor(private itemService: ItemService) { }

  @Get('')
  getAll(@Query('companyId') companyId: string): Observable<Item[]> {
    const where = companyId ? { companyId } : null;
    return this.itemService.getAll(where);
  }

  @Get('byCode/:companyId/:code')
  getByCode(@Param('companyId') companyId: string, @Param('code') code: string): Observable<Item> {
    return this.itemService.getItemByCode(companyId, code);
  }

  @Get('byBarCode/:companyId/:barCode')
  getByBarCode(@Param('companyId') companyId: string, @Param('barCode') barCode: string): Observable<Item> {
    return this.itemService.getItemByBarCode(companyId, barCode);
  }

  @Get('byName/:companyId/:name')
  getByName(@Param('companyId') companyId: string, @Param('name') name: string): Observable<Item[]> {
    return this.itemService.getItemsByName(companyId, name);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Observable<void> {
    return this.itemService.remove(id);
  }

}

import { AppAuthGuard } from './../auth/auth.guard';
import { Item } from './item.model';
import { ItemService } from './item.service';
import { Observable } from 'rxjs';
import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger';
import { Controller, Get, Query, Delete, Param, UseGuards } from '@nestjs/common';

@ApiUseTags('Items')
@ApiBearerAuth()
@Controller('items')
@UseGuards(AppAuthGuard)
export class ItemController {

  constructor(private itemService: ItemService) { }

  @Get('')
  getAll(@Query('companyId') companyId: string, @Query('page') page: number): Observable<Item[]> {
    const where = companyId ? { companyId } : null;
    return this.itemService.getAll(where, page);
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

import { CreateItemDto } from './create-item.dto';
import { AppAuthGuard } from './../auth/auth.guard';
import { Item } from './item.model';
import { ItemService } from './item.service';
import { Observable } from 'rxjs';
import { ApiUseTags, ApiBearerAuth, ApiOperation, ApiImplicitQuery, ApiImplicitParam } from '@nestjs/swagger';
import { Controller, Get, Query, Delete, Param, UseGuards, Req, Body, Patch } from '@nestjs/common';

@ApiUseTags('Items')
@ApiBearerAuth()
@Controller('items')
@UseGuards(AppAuthGuard)
export class ItemController {

  constructor(private itemService: ItemService) { }

  @Get('')
  @ApiOperation({
    title: 'Get all items for specified company',
    description: `Get all items for specified company by parameter [companyId].
    Parameter [page] uses for pagination. Limit is 30 rows per page.
    Pagination start form 1. To see all records don't provide [page] parameter
    `
  })
  @ApiImplicitQuery({ name: 'page', required: false, type: 'Number', description: 'uses for pagination' })
  @ApiImplicitQuery({ name: 'companyId', required: true, type: 'string', description: 'id of company' })
  getAll(@Query('companyId') companyId: string, @Query('page') page?: number): Observable<Item[]> {
    const where = companyId ? { companyId } : null;
    return this.itemService.getAll(where, page);
  }

  @Get('count')
  getCount(@Query('companyId') companyId: string): Observable<number> {
    const where = companyId ? { companyId } : null;
    return this.itemService.getCount(where);
  }

  @Get('available/:companyId/:code')
  @ApiOperation({
    title: 'Get items available in specified company hierarchy',
    description: 'Uses for Mobile App only'
  })
  @ApiImplicitParam({ name: 'companyId', required: true, type: 'string', description: 'id of company' })
  @ApiImplicitParam({ name: 'code', required: true, type: 'String', description: 'Item code' })
  getAvailableByCode(@Param('companyId') companyId: string, @Param('code') code: string): Observable<Item[]> {
    return this.itemService.getAvailableByCode(companyId, code);
  }

  @Get(':id')
  @ApiOperation({
    title: 'Get item by Id',
    description: 'Returns Item full info by his Id'
  })
  @ApiImplicitParam({ name: 'id', required: true, type: 'string', description: 'id of item' })
  get(@Param('id') id: string): Observable<Item> {
    return this.itemService.getItemById(id);
  }

  @Get('byId/:id')
  @ApiOperation({
    title: 'Get item by Id',
    description: 'Returns Item full info by his Id',
    deprecated: true
  })
  @ApiImplicitParam({ name: 'id', required: true, type: 'string', description: 'id of item' })
  getById(@Param('id') id: string): Observable<Item> {
    return this.itemService.getItemById(id);
  }

  @Get('byCode/:companyId/:code')
  @ApiOperation({
    title: 'Get item by code',
    description: 'Returns Item full info by his code for specified company'
  })
  @ApiImplicitQuery({ name: 'companyId', required: true, type: 'string', description: 'id of company' })
  @ApiImplicitQuery({ name: 'code', required: true, type: 'String', description: 'code of item' })
  getByCode(@Param('companyId') companyId: string, @Param('code') code: string): Observable<Item> {
    return this.itemService.getItemByCode(companyId, code);
  }

  @Get('byBarCode/:companyId/:barCode')
  @ApiOperation({
    title: 'Get item by bar code',
    description: 'Returns Item full info by his bar code for specified company'
  })
  @ApiImplicitQuery({ name: 'companyId', required: true, type: 'string', description: 'id of company' })
  @ApiImplicitQuery({ name: 'barCode', required: true, type: 'String', description: 'barCode of item' })
  getByBarCode(@Param('companyId') companyId: string, @Param('barCode') barCode: string): Observable<Item> {
    return this.itemService.getItemByBarCode(companyId, barCode);
  }

  @Get('byName/:companyId/:name')
  @ApiOperation({
    title: 'Get item by bar code',
    description: 'Returns Item full info by his name for specified company'
  })
  @ApiImplicitQuery({ name: 'companyId', required: true, type: 'string', description: 'id of company' })
  @ApiImplicitQuery({ name: 'name', required: true, type: 'String', description: 'name of item' })
  getByName(@Param('companyId') companyId: string, @Param('name') name: string): Observable<Item[]> {
    return this.itemService.getItemsByName(companyId, name);
  }

  @Patch(':id')
  @ApiOperation({
    title: 'Modify item by id'
  })
  @ApiImplicitQuery({ name: 'id', required: true, type: 'string', description: 'id of item' })
  modify(@Param('id') id: string, @Body() itemDto: CreateItemDto): Observable<Item> {
    return this.itemService.modify(id, itemDto);
  }

  @Delete(':id')
  @ApiOperation({
    title: 'Delete item by id'
  })
  @ApiImplicitParam({ name: 'id', required: true, type: 'string', description: 'id of item' })
  remove(@Param('id') id: string): Observable<void> {
    return this.itemService.remove(id);
  }

}

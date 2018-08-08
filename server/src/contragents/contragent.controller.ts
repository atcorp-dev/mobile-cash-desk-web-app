import { CreateItemDto } from './../inventory/create-item.dto';
import { Item } from './../inventory/item.model';
import { CreateContragentDto } from './create-contragent.dto';
import { Observable } from 'rxjs';
import { ContragentService } from './contragent.service';
import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { Guid } from 'guid-typescript';
import { ApiUseTags } from '@nestjs/swagger';
import { Contragent } from './contragent.model';

@ApiUseTags('Contragents')
@Controller('Contragents')
export class ContragentController {

  constructor(private contragentService: ContragentService) {}

  @Get()
  getAll(): Observable<Array<Contragent>> {
    return this.contragentService.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: string): Observable<Contragent> {
    return this.contragentService.getById(id);
  }

  @Post()
  create(@Body() createContragent: CreateContragentDto): Observable<any> {
    return this.contragentService.create(createContragent);
  }

  @Get(':id/items')
  getContragentItems(@Param('id') id: string): Observable<Item[]> {
    return this.contragentService.getItems(id);
  }

  @Post(':id/items')
  addContragentItem(@Param('id') id: string, @Body() itemDto: CreateItemDto): Observable<any> {
    return this.contragentService.addItem(id, itemDto);
  }
}
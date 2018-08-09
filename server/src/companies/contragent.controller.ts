import { CreateItemDto } from './../inventory/create-item.dto';
import { Item } from './../inventory/item.model';
import { CreateCompanyDto } from './create-company.dto';
import { Observable } from 'rxjs';
import { CompanyService } from './company.service';
import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { Guid } from 'guid-typescript';
import { ApiUseTags } from '@nestjs/swagger';
import { Company } from './company.model';

@ApiUseTags('Companies')
@Controller('Companies')
export class CompanyController {

  constructor(private companyService: CompanyService) {}

  @Get()
  getAll(): Observable<Array<Company>> {
    return this.companyService.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: string): Observable<Company> {
    return this.companyService.getById(id);
  }

  @Post()
  create(@Body() createCompany: CreateCompanyDto): Observable<any> {
    return this.companyService.create(createCompany);
  }

  @Get(':id/items')
  getCompanyItems(@Param('id') id: string): Observable<Item[]> {
    return this.companyService.getItems(id);
  }

  @Post(':id/items')
  addCompanyItem(@Param('id') id: string, @Body() itemDto: CreateItemDto): Observable<any> {
    return this.companyService.addItem(id, itemDto);
  }
}
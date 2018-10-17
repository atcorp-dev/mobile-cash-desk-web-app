import { AppAuthGuard } from './../auth/auth.guard';
import { CreateItemDto } from '../inventory/create-item.dto';
import { Item } from '../inventory/item.model';
import { CreateCompanyDto } from './create-company.dto';
import { Observable } from 'rxjs';
import { CompanyService } from './company.service';
import { Controller, Get, Post, Param, Body, Delete, UseGuards, Query, Req, Patch } from '@nestjs/common';
import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger';
import { Company } from './company.model';

@ApiUseTags('Companies')
@ApiBearerAuth()
@Controller('companies')
@UseGuards(AppAuthGuard)
export class CompanyController {

  constructor(private companyService: CompanyService) { }

  @Get()
  getAll(@Query('page') page: number, @Req() req): Observable<Array<Company>> {
    return this.companyService.getAll(page, req.user);
  }

  @Get(':id')
  getById(@Param('id') id: string): Observable<Company> {
    return this.companyService.getById(id);
  }

  @Post()
  create(@Body() createCompany: CreateCompanyDto): Observable<any> {
    return this.companyService.create(createCompany);
  }

  @Patch(':id')
  modify(@Param('id') id: string, @Body() companyDto: CreateCompanyDto): Observable<Company> {
    return this.companyService.modify(id, companyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Observable<boolean> {
    return this.companyService.remove(id);
  }

  @Get(':id/items')
  getCompanyItems(@Param('id') id: string, @Query('page') page: number): Observable<Item[]> {
    return this.companyService.getItems(id, +page);
  }

  @Post(':id/items')
  addCompanyItem(@Param('id') id: string, @Body() itemDto: CreateItemDto): Observable<any> {
    return this.companyService.addItem(id, itemDto);
  }

}
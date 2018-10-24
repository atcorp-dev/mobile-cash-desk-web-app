import { UserRole } from './../user/user.model';
import { ReqUser } from './../user/user.decorator';
import { FindApiResponse } from './../find-api.response';
import { AppAuthGuard } from './../auth/auth.guard';
import { CreateItemDto } from '../inventory/create-item.dto';
import { Item } from '../inventory/item.model';
import { CreateCompanyDto } from './create-company.dto';
import { Observable } from 'rxjs';
import { CompanyService } from './company.service';
import { Controller, Get, Post, Param, Body, Delete, UseGuards, Query, Req, Patch } from '@nestjs/common';
import { ApiUseTags, ApiBearerAuth, ApiImplicitQuery, ApiOperation } from '@nestjs/swagger';
import { Company } from './company.model';
import { User } from '../user/user.model';

@ApiUseTags('Companies')
@ApiBearerAuth()
@Controller('companies')
@UseGuards(AppAuthGuard)
export class CompanyController {

  constructor(private companyService: CompanyService) { }

  @Get()
  @ApiOperation({
    title: 'Get all companies',
    description: `Get all companies that available for current user (based on user primary company).
    Parameter [page] uses for pagination. Limit is 30 rows per page.
    Pagination start form 1. To see all records don't provide [page] parameter
    `
  })
  @ApiImplicitQuery({ name: 'page', required: false, description: 'uses for pagination' })
  getAll(@Query('page') page: number, @Req() req): Observable<Array<Company>> {
    return this.companyService.getAll(page, req.user);
  }

  @Get(':id')
  @ApiOperation({ title: 'Get company by Id'})
  getById(@Param('id') id: string): Observable<Company> {
    return this.companyService.getById(id);
  }

  @Post()
  @ApiOperation({
    title: 'Create new company',
    description: 'Required that User must be Admin'
  })
  create(@Body() createCompany: CreateCompanyDto, @ReqUser() user: User): Observable<any> {
    return this.companyService.create(createCompany, user);
  }

  @Patch(':id')
  @ApiOperation({
    title: 'Modify company by id',
    description: 'Required that User must be Admin'
  })
  modify(@Param('id') id: string, @Body() companyDto: CreateCompanyDto, @ReqUser() user: User): Observable<Company> {
    return this.companyService.modify(id, companyDto, user);
  }

  @Delete(':id')
  @ApiOperation({
    title: 'Remove company by id',
    description: 'Required that User must be Admin'
  })
  remove(@Param('id') id: string, @ReqUser() user: User): Observable<boolean> {
    return this.companyService.remove(id, user);
  }

  @Get(':id/items')
  @ApiOperation({
    title: 'Get all company items',
    description: `Get all companies items by company id.
    Parameter [page] uses for pagination. Limit is 30 rows per page.
    Pagination start form 1. To see all records don't provide [page] parameter
    `
  })
  @ApiImplicitQuery({ name: 'page', required: false })
  getCompanyItems(@Param('id') id: string, @Query('page') page: number): Observable<Item[]> {
    return this.companyService.getItems(id, +page);
  }

  @Post(':id/item')
  @ApiOperation({
    title: 'Create company item'
  })
  addCompanyItem(@Param('id') id: string, @Body() itemDto: CreateItemDto): Observable<any> {
    return this.companyService.addItem(id, itemDto);
  }

}
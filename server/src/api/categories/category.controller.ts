import { AppAuthGuard } from './../auth/auth.guard';
import { Observable } from 'rxjs';
import { CategoryService } from './category.service';
import { Controller, Get, Post, Param, Body, Delete, UseGuards, NotImplementedException } from '@nestjs/common';
import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger';
import { Category } from './category.model';
import { CreateCategoryDto } from './create-category.dto';

@ApiUseTags('Categories (not implemented)')
@ApiBearerAuth()
@Controller('categories')
@UseGuards(AppAuthGuard)
export class CategoryController {

  constructor(private categoryService: CategoryService) { }

  @Get()
  getAll(): Observable<Array<Category>> {
    throw new NotImplementedException();
    return this.categoryService.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: string): Observable<Category> {
    throw new NotImplementedException();
    return this.categoryService.getById(id);
  }

  @Post()
  create(@Body() createCategory: CreateCategoryDto): Observable<any> {
    throw new NotImplementedException();
    return this.categoryService.create(createCategory);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Observable<boolean> {
    throw new NotImplementedException();
    return this.categoryService.remove(id);
  }

}
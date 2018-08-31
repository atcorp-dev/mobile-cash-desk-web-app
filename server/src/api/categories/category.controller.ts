import { CreateCategoryDto } from './create-Category.dto';
import { Observable } from 'rxjs';
import { CategoryService } from './category.service';
import { Controller, Get, Post, Param, Body, Delete } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';
import { Category } from './category.model';

@ApiUseTags('Categories')
@Controller('categories')
export class CategoryController {

  constructor(private categoryService: CategoryService) { }

  @Get()
  getAll(): Observable<Array<Category>> {
    return this.categoryService.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: string): Observable<Category> {
    return this.categoryService.getById(id);
  }

  @Post()
  create(@Body() createCategory: CreateCategoryDto): Observable<any> {
    return this.categoryService.create(createCategory);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Observable<boolean> {
    return this.categoryService.remove(id);
  }

}
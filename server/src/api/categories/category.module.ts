import { CategoryService } from './category.service';
import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryProviders } from './category.provider';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [CategoryController],
  providers: [
    CategoryService,
    ...CategoryProviders
  ]
})
export class CategoryModule { }

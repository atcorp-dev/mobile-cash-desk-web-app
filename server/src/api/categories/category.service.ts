import { Category } from './category.model';
import { Injectable, Inject } from '@nestjs/common';
import { Observable, from, of } from 'rxjs';
import { Item } from '../inventory/item.model';
import { switchMap } from 'rxjs/operators';
// import { CreateCategoryDto } from './create-category.dto';

@Injectable()
export class CategoryService {

  public constructor(
    @Inject('CategoryRepository') private readonly categoryRepository: typeof Category,
    @Inject('ItemRepository') private readonly itemRepository: typeof Item
  ) { }

  getAll(): Observable<Array<Category>> {
    const response = this.categoryRepository.findAll();
    return from(response);
  }

  getById(id: string): Observable<Category> {
    const response = this.categoryRepository.findById<Category>(id);
    return from(response);
  }

  create(createCategory: any): Observable<Category> {
    const response = this.categoryRepository.create(createCategory);
    return from(response);
  }

  remove(id: string): Observable<boolean> {
    return from(
      this.itemRepository.count({
        where: { categoryId: id }
      })
    )
      .pipe(
        switchMap(count => {
          if (!count) {
            return this.categoryRepository.findById<Category>(id);
          }
          return of(null);
        }),
        switchMap((category: Category) => {
          if (category) {
            return category.destroy()
              .then(() => true);
          }
          return of(false);
        })
      );
  }

}
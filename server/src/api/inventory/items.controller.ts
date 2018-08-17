import { Item } from './item.model';
import { ItemService } from './item.service';
import { Observable } from 'rxjs';
import { ApiUseTags } from '@nestjs/swagger';
import { Controller, Get } from '@nestjs/common';

@ApiUseTags('Items')
@Controller('items')
export class ItemController {

  constructor(private itemService: ItemService) { }

  @Get('')
  getAll(): Observable<Item[]> {
    return this.itemService.getAll();
  }
}

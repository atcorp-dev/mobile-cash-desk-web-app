import { map } from 'rxjs/operators';
import { InventoryService } from './inventory.service';
import { Observable } from 'rxjs';
import { ApiUseTags, ApiImplicitBody } from '@nestjs/swagger';
import { Controller, Post, UseInterceptors, FileInterceptor, UploadedFile } from '@nestjs/common';

@ApiUseTags('Inventory')
@Controller('inventory')
export class InventoryController {

  constructor(private inventoryService: InventoryService) {}

  @Post('importFromCsv')
  @UseInterceptors(FileInterceptor('file'))
  importFromCsv(@UploadedFile() file): Observable<any[]> {
    return this.inventoryService.importFromCsv(file);
  }
}

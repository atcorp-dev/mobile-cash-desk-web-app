import { map } from 'rxjs/operators';
import { InventoryService } from './inventory.service';
import { Observable, of } from 'rxjs';
import { ApiUseTags, ApiImplicitBody } from '@nestjs/swagger';
import { Controller, Post, UseInterceptors, FileInterceptor, UploadedFile, Param, Get, Res } from '@nestjs/common';

@ApiUseTags('Inventory')
@Controller('inventory')
export class InventoryController {

  constructor(private inventoryService: InventoryService) {}

  @Post(':companyCode/importFromCsv')
  @UseInterceptors(FileInterceptor('file'))
  importFromCsv(@Param('companyCode') companyCode: string, @UploadedFile() file): Observable<any[]> {
    return this.inventoryService.importFromCsv(companyCode, file);
  }

  @Get('template')
  getTemplate(@Res() res){
    res.set({ 'Content-Disposition': 'attachment; filename=item_upload_template.csv' });
    res.send(this.inventoryService.getTemplate());
  }
}

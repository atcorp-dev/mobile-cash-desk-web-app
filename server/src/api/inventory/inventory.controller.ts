import { InventoryService } from './inventory.service';
import { Observable } from 'rxjs';
import { ApiUseTags } from '@nestjs/swagger';
import { Controller, Post, UseInterceptors, FileInterceptor, UploadedFile, Param, Get, Res, Req, Inject, HttpStatus, UseGuards } from '@nestjs/common';
import { AppAuthGuard } from './../auth/auth.guard';

@ApiUseTags('Inventory')
@Controller('inventory')
@UseGuards(AppAuthGuard)
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

  @Post('makeImport/:companyId')
  makeImport(@Param('companyId') companyId: string, @Req() req, @Res() res) {
    return this.inventoryService.makeImport(companyId, req.user)
      .subscribe(
        result => res.status(HttpStatus.OK).send(result)
      );
  }
}

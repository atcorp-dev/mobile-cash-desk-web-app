import { Guid } from 'guid-typescript';
import { PrestaShopIntegrationService } from './../integration/prestashop/prestashop.service';
import { map, switchMap, catchError } from 'rxjs/operators';
import { InventoryService } from './inventory.service';
import { Observable, of, from } from 'rxjs';
import { ApiUseTags, ApiImplicitBody } from '@nestjs/swagger';
import { Controller, Post, UseInterceptors, FileInterceptor, UploadedFile, Param, Get, Res, Req, Inject } from '@nestjs/common';
import { Item } from './item.model';

@ApiUseTags('Inventory')
@Controller('inventory')
export class InventoryController {

  constructor(
    private inventoryService: InventoryService,
    private readonly prestaShopIntegrationService: PrestaShopIntegrationService,
    @Inject('ItemRepository') private readonly itemRepository: typeof Item
    ) {}

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
  makeImport(@Param('companyId') companyId: string, @Req() req): Observable<any> {
    return this.prestaShopIntegrationService.importItems(companyId).pipe(
      switchMap(res => {
        let items = [];
        if (res && res.data && res.data.products) {
          items = res.data.products.map(x => <Item>{
            id: Guid.create().toString(),
            extCode: x.id,
            available: +x.active === 1,
            code: x.reference,
            companyId,
            name: x.name[0].value,
            additionalFields: x
          });
        } else {
          return of(null);
        }
        return from(this.itemRepository.bulkCreate(items)).pipe(
          catchError(err =>{
            throw err;
          })
        )
    }));
  }
}

import { catchError } from 'rxjs/operators';
import { 
  Controller,
  Post,
  UseInterceptors,
  FileInterceptor,
  UploadedFile,
  Param, 
  Get,
  Res,
  Req, 
  HttpStatus,
  UseGuards,
  Body, 
  Query,
  BadRequestException
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { Observable } from 'rxjs';
import { ApiUseTags, ApiImplicitBody, ApiImplicitQuery } from '@nestjs/swagger';
import { AppAuthGuard } from './../auth/auth.guard';
import { CreateItemDto } from './create-item.dto';
import { ReqUser } from '../user/user.decorator';
import { User } from '../user/user.model';

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

  @Post('bulkCreateItems')
  // @ApiImplicitBody({ name: 'createItemsDto', required: true, isArray: true, type: 'array'})
  @ApiImplicitQuery({ name: 'companyId', required: true, type: 'string'})
  bulkCreateItems(
    @Body() createItemsDto: Array<CreateItemDto>, @Query('companyId') companyId: string, @ReqUser() user: User
  ): Observable<any> {
    return this.inventoryService.bulkCreateItems(createItemsDto, companyId, user)
    .pipe(
      catchError (err => {
        console.log(err);
        throw new BadRequestException(err.message);
      })
    );
  }
}

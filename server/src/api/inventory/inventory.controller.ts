import { Company } from './../companies/company.model';
import { catchError, switchMap } from 'rxjs/operators';
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
  BadRequestException,
  Inject
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { Observable, from } from 'rxjs';
import { ApiUseTags, ApiImplicitBody, ApiImplicitQuery, ApiBearerAuth } from '@nestjs/swagger';
import { AppAuthGuard } from './../auth/auth.guard';
import { CreateItemDto } from './create-item.dto';
import { ReqUser, SessionUser } from '../user/user.decorator';
import { User } from '../user/user.model';

@ApiUseTags('Inventory')
@Controller('inventory')
@ApiBearerAuth()
@UseGuards(AppAuthGuard)
export class InventoryController {

  constructor(
    private inventoryService: InventoryService,
    @Inject('CompanyRepository') private readonly companyRepository: typeof Company
  ) {}

  @Post(':companyCode/importFromCsv')
  @UseInterceptors(FileInterceptor('file'))
  importFromCsvByCompanyCode(@Res() res, @Param('companyCode') code: string, @UploadedFile() file, @SessionUser() user: User): any | Observable<any[]> {
    return from(
      this.companyRepository.findOne({ where: { code }})
    ).pipe(
      switchMap(company => this.inventoryService.importFromCsv(company, file, user)),
      catchError(err => {
        console.log(err);
        throw new BadRequestException(err.message);
      })
    ).subscribe(result => res.send(result));
  }

  @Post('importFromCsv/:companyId')
  @UseInterceptors(FileInterceptor('file'))
  importFromCsv(@Res() res, @Param('companyId') companyId: string, @UploadedFile() file, @SessionUser() user: User): any | Observable<any[]> {
    return from(
      this.companyRepository.findById(companyId)
    ).pipe(
      switchMap(company => this.inventoryService.importFromCsv(company, file, user)),
      catchError(err => {
        console.log(err);
        throw new BadRequestException(err.message);
      })
    ).subscribe(result => res.send(result));
  }

  @Get('template')
  getTemplate(@Res() res){
    res.set({ 'Content-Disposition': 'attachment; filename=item_upload_template.csv' });
    res.send(this.inventoryService.getTemplate());
  }

  @Post('makeImport/:companyId')
  makeImport(@Param('companyId') companyId: string, @Req() req, @Res() res) {
    return this.inventoryService.makeImport(companyId, req.user)
      .pipe(
        catchError(err => {
          //console.dir(err);
          console.error(err);
          throw new BadRequestException(err.message);
        })
      )
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
        //console.dir(err);
        console.error(err);
        throw new BadRequestException(err.message);
      })
    );
  }

  @Post('bulkUpsertItems')
  // @ApiImplicitBody({ name: 'createItemsDto', required: true, isArray: true, type: 'array'})
  @ApiImplicitQuery({ name: 'companyId', required: true, type: 'string'})
  bulkUpsertItems(
    @Res() res, @Body() createItemsDto: Array<CreateItemDto>, @Query('companyId') companyId: string, @ReqUser() user: User
  ) {
    this.inventoryService.bulkUpsertItems(createItemsDto, companyId, user)
    .subscribe(
      result => res.status(HttpStatus.OK).send(result),
      err => {
        //console.dir(err);
        console.error(err);
        throw new BadRequestException(err.message);
      }
    );
  }
}

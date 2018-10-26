import { IntegrationService } from './../integration/integration.service';
import { PrestaShopIntegrationService } from './../integration/prestashop/prestashop.service';
import { Guid } from 'guid-typescript';
import { Company } from './../companies/company.model';
import { from } from 'rxjs';
import { Observable } from 'rxjs';
import { Item } from './item.model';
import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import * as CSV from 'csv-string';
import { switchMap, map, catchError } from 'rxjs/operators';
import { User } from '../user/user.model';
import { CreateItemDto } from './create-item.dto';

@Injectable()
export class InventoryService {

  private template = ['NAME', 'EXT_CODE', 'CODE', 'BAR_CODE', 'PRICE'];
  constructor(
    @Inject('ItemRepository') private readonly itemRepository: typeof Item,
    @Inject('CompanyRepository') private readonly companyRepository: typeof Company,
    private readonly prestaShopIntegrationService: PrestaShopIntegrationService,
  ) {}

  public makeImport(companyId: string, user: User): Observable<any> {
    return from(
      this.companyRepository.findById(companyId)
    ).pipe(
      switchMap(
        company => this.getIntegrationService(company).importItems({ company, user })
      ),
      catchError(err => {
        console.error(err);
        throw err;
      })
    )
  }

  public importFromCsv(companyCode: string, file): Observable<any> {
    const data: Buffer = file.buffer;
    const csv = data.toString();
    const arr: Array<string[]> = CSV.parse(csv);
    console.log(arr[1]);
    const headers = arr.shift();
   // this.validateHeaders(headers);
    const items = arr.map(values => {
      const [name, extCode, code, barCode, price, description] = values;
      return { 
        id: Guid.create().toString(),
        name,
        code,
        extCode,
        barCode,
        price: this.toDecimal(price),
        description,
        companyId: null
      }
    });
    return from (
      this.companyRepository.find({ where: { code: companyCode } })
    )
    .pipe(
      switchMap(company => {
        items.forEach(item => item.companyId = company.id);
        return this.removeItems(company.id, items)
      }),
      switchMap(() => from(
        this.itemRepository.bulkCreate(items)
      ))
    );
  }

  public bulkCreateItems(createItemsDto: Array<CreateItemDto>, companyId, user: User): Observable<any> {
    if (!Array.isArray(createItemsDto)) {
      throw new BadRequestException(`input parameter is not array`);
    }
    if ((!user && user.companyId) || !companyId) {
      throw new BadRequestException(`Company not specified`);
    }
    const records = createItemsDto.map(dto => Object.assign({}, dto, {
      createdById: user && user.id,
      modifiedById: user && user.id,
      companyId: companyId || (user && user.companyId)
    }));
    return from(this.itemRepository.bulkCreate(records, { individualHooks: true })).pipe(
      map(
        items => Object.assign({}, { rowsAffected: items.length })
      )
    );
  }

  public getTemplate(): string {
    return this.template
      .join(';');
  }

  private toDecimal(value: string): number {
    return Number.parseFloat(value && value.replace(',', '.')) || 0;
  }

  private validateHeaders(headers: Array<string>) {
    const validHeaders = this.template;
    validHeaders.forEach((validHeader, i) => {
      const header = headers[i] || '';
      if (header.toUpperCase() !== validHeader) {
        console.log(headers.join(','));
        console.log(`${header} not equal ${validHeader}`);
        throw new BadRequestException('Invalid data structure')
      }
    });
  }

  private removeItems(companyId: string, items: Array<any>): Observable<any> {
    const codes = [];
    items.forEach(item => {
      if (codes.indexOf(item.code) == -1) {
        codes.push(item.code);
      }
    })
    return from(
      this.itemRepository.destroy({
        where: {
          code: codes,
          companyId
        }
      })
    );
  }

  private getIntegrationService(company: Company): IntegrationService {
    const integrationConfig = company.extras && company.extras.integrationConfig;
    if (integrationConfig) {
      switch (integrationConfig.service) {
        case 'PrestaShopIntegrationService':
          return this.prestaShopIntegrationService
        default:
          throw new BadRequestException('Can\'not find integration service');
      }
    }
    throw new BadRequestException('Integration config not set for this company');
  }

}

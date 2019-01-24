import { GateItem } from './gate-item.model';
import { IntegrationService, ImportResult } from './../integration/integration.service';
import { PrestaShopIntegrationService } from './../integration/prestashop/prestashop.service';
import { Guid } from 'guid-typescript';
import { Company } from './../companies/company.model';
import { from } from 'rxjs';
import { Observable } from 'rxjs';
import { Item } from './item.model';
import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import * as CSV from 'csv-string';
import { switchMap, map, catchError, finalize } from 'rxjs/operators';
import { User } from '../user/user.model';
import { CreateItemDto } from './create-item.dto';

@Injectable()
export class InventoryService {

  private template = ['NAME', 'EXT_CODE', 'CODE', 'BAR_CODE', 'PRICE', 'AVAILABLE', 'DESCRIPTION', 'FEATURE_KEY_N', 'FEATURE_VALUE_N'];
  constructor(
    @Inject('ItemRepository') private readonly itemRepository: typeof Item,
    @Inject('GateItemRepository') private readonly gateItemRepository: typeof GateItem,
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

  public importFromCsv(company: Company, file, user: User): Observable<any> {
    const data: Buffer = file.buffer;
    const csv = data.toString();
    const key = Guid.create().toString();
    const getRow = row => {
      const [name, extCode, code, barCode, price, available, description, ...features] = row;
      return {
        key,
        id: Guid.create().toString(),
        createdById: user && user.id,
        createdOn: new Date(),
        modifiedById: user && user.id,
        modifiedOn: new Date(),
        name,
        code,
        extCode,
        barCode,
        price: this.toDecimal(price),
        description,
        available: +available === 1,
        companyId: company.id,
        additionalFields: features && this.getCsvFeatures(features),
        source: row
      }
    }
    const items = [];
    CSV.forEach(csv, ';', '`', row => items.push(getRow(row)));
    const headers = items.shift();
    return from(
      this.gateItemRepository.bulkCreate(items)
    ).pipe(
      switchMap(() => GateItem.upsertItems(key)),
      switchMap(() => GateItem.destroy({ where: { key } })),
      map(() => <ImportResult>{ rowsAffected: items.length })
    );
  }

  public bulkCreateItems(createItemsDto: Array<CreateItemDto>, companyId, user: User): Observable<any> {
    if (createItemsDto == null || createItemsDto == undefined) {
      throw new BadRequestException(`input parameter [createItemsDto] is not defined`);
    }
    if (!Array.isArray(createItemsDto)) {
      throw new BadRequestException(`input parameter [createItemsDto] is not array`);
    }
    if ((!user && user.companyId) || !companyId) {
      throw new BadRequestException(`User->Company not specified`);
    }
    const records = createItemsDto.map(dto => Object.assign({}, dto, {
      id: Guid.create().toString(),
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

  public bulkUpsertItems(createItemsDto: Array<CreateItemDto>, companyId, user: User): Observable<any> {
    if (createItemsDto == null || createItemsDto == undefined) {
      throw new BadRequestException(`input parameter [createItemsDto] is not defined`);
    }
    if (!Array.isArray(createItemsDto)) {
      throw new BadRequestException(`input parameter [createItemsDto] is not array`);
    }
    if ((!user && user.companyId) || !companyId) {
      throw new BadRequestException(`User->Company not specified`);
    }
    const key = Guid.create().toString();
    createItemsDto.forEach((dto: any) => {
      dto.id = Guid.create().toString();
      dto.createdById = user && user.id;
      dto.modifiedById = user && user.id;
      dto.key = key;
      dto.companyId = companyId || (user && user.companyId);
      dto.extCode = dto.extCode || dto.code || dto.barCod;
    });
    return from(this.gateItemRepository.bulkCreate(createItemsDto, { individualHooks: true, returning: false })).pipe(
      switchMap(() => {
        return GateItem.upsertItems(key)
      }),
      /*switchMap(() => {
        return GateItem.destroy({ where: { key } })
      }),*/
      map(() => {
        return <ImportResult>{ rowsAffected: createItemsDto.length }
      }),
      catchError(err => {
        GateItem.destroy({ where: { key } })
        throw err;
      })
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

  private getCsvFeatures(row: Array<any>): {name: string, value: string}[] {
    const res = [];
    for(let i = 0; i < row.length; i += 2) {
      const name = row[i];
      const value = row[i + 1];
      if (name && (value || value === 0)) {
        res.push({ name, value });
      }
    }
    return res;
  }

}

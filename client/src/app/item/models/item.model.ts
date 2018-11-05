import { Company } from './../../company/models/company.model';
export class Item {
  public id: string;
  public name: string;
  public code: string;
  public barCode: string;
  public description: string;
  public price: number;
  public available: boolean;
  public company: Company;
  public companyId: string;
  public additionalFields: Array<{name: string, value: string}>;
}

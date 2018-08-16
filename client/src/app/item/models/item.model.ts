import { Company } from './../../company/models/company.model';
export class Item {
  public id: string;
  public name: string;
  public code: string;
  public description: string;
  public price: number;
  public company: Company;
  public companyId: string;
}

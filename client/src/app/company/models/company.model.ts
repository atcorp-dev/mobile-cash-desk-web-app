export class Company {
  public id: string;
  public parentId: string;
  public parent: Company;
  public code: string;
  public name: string;
  public email: string;
  public phone: string;
  public address: string;
  public extras: any;
  public active: boolean;
}

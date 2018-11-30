import { Injectable } from "@nestjs/common";
import { Company } from "./api/companies/company.model";

const Companies: {[x:string]: string} = {};

@Injectable()
export class AppService {

  public static initCompanies() {
    Company
      .findAll()
      .then(companies => companies
        .forEach(company => {
          Companies[company.code] = company.id
        })
      );
  }

  public static getCompanyId(code: string): string|null  {
    return Companies && Companies[code] || null;
  }
}
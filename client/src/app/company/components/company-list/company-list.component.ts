import { Observable } from 'rxjs';
import { DataService } from './../../../core/services/data.service';
import { Component, OnInit } from '@angular/core';
import { Company } from '../../models/company.model';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CompanyDataService } from 'src/app/company/services/company-data.service';

@Component({
  selector: 'app-company',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.css'],
  providers: [CompanyDataService]
})
export class CompanyListComponent implements OnInit {

  displayedColumns: string[] = ['name', 'code', 'email', 'phone'];
  dataSource: Array<Company> = [];
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private dataService: CompanyDataService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadCompanies();
    this.createForm();
  }

  createForm() {
    this.form = this.formBuilder.group({
      name: [null, [Validators.required]],
      code: [null, [Validators.required]],
      email: null,
      phone: null,
    });
  }

  loadCompanies() {
    this.dataService.get(Company).subscribe(
      data => this.dataSource = data
    );
  }

  openEditPage(id) {
    this.router.navigate(['..', 'company', id], { relativeTo: this.route });
  }

  create() {
    this.dataService.post(
      this.form.value
    ).subscribe(() => {
      this.form.reset();
      this.loadCompanies();
    });
  }

}

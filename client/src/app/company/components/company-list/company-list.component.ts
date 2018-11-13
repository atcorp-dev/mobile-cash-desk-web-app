import { Component, OnInit } from '@angular/core';
import { Company } from '../../models/company.model';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CompanyDataService } from 'src/app/company/services/company-data.service';
import { finalize } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.css'],
  providers: [CompanyDataService]
})
export class CompanyListComponent implements OnInit {

  displayedColumns: string[] = ['name', 'code', 'email', 'phone', 'parent', 'menu'];
  dataSource: Array<Company> = [];
  form: FormGroup;
  addButtonDisabled: boolean;
  loading: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private dataService: CompanyDataService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.loadCompanies();
    this.createForm();
  }

  openSnackBar(message: string, action?: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
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
    this.loading = true;
    this.dataService.get(Company)
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe(
        data => this.dataSource = data
      );
  }

  openEditPage(id) {
    this.router.navigate(['..', 'company', id], { relativeTo: this.route });
  }

  create() {
    this.loading = true;
    this.addButtonDisabled = true;
    this.dataService.post(
      this.form.value
    )
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe(() => {
        this.form.reset();
        this.loadCompanies();
        this.addButtonDisabled = false;
        this.openSnackBar('Saved');
      });
  }

  remove(id: string) {
    this.loading = true;
    this.dataService.delete(id)
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe(success => {
        if (success) {
          this.loadCompanies();
          this.openSnackBar('Removed');
        } else {
          this.openSnackBar('Company can not be deleted');
        }
      });
  }

  onAddButtonClick() {
    this.router.navigate(['/company']);
  }

}

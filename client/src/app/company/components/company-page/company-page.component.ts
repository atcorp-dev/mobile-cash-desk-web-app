import { MediaMatcher } from '@angular/cdk/layout';
import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Company } from '../../models/company.model';
import { CompanyDataService } from '../../services/company-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { Observable, of } from 'rxjs';
import { switchMap, finalize, map } from 'rxjs/operators';

@Component({
  selector: 'app-company-page',
  templateUrl: './company-page.component.html',
  styleUrls: ['./company-page.component.css'],
  providers: [
    CompanyDataService
  ]
})
export class CompanyPageComponent implements OnDestroy, OnInit {

  form: FormGroup;
  companyList: Array<Company>;
  loading: boolean;
  company: Company;
  userList: Array<any> = [];
  userDisplayedColumns: string[] = ['name', 'code', 'login'];
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  get layoutCols(): number {
    return this.mobileQuery.matches ? 12 : 24;
  }

  constructor(
    private formBuilder: FormBuilder,
    private dataService: CompanyDataService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private location: Location,
    private changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher,
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
    this.createForm();
    this.loadCompanies();
    this.getRecordId().pipe(
      switchMap(id => {
        if (id) {
          this.loadCompanies(id);
          this.loadUsers(id);
        }
        return this.loadCompany(id);
      })
    ).subscribe(company => company && this.setFormValues(company));
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  openSnackBar(message: string, action?: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  createForm() {
    this.form = this.formBuilder.group({
      name: [null, [Validators.required]],
      parentId: null,
      code: [null, [Validators.required]],
      email: null,
      phone: null,
      address: null,
      active: false
    });
  }

  cancel() {
    this.location.back();
  }

  getSaveQuery(values): Observable<any> {
    return this.company
      ? this.dataService.patch(this.company.id, values)
      : this.dataService.post(values);
  }

  save() {
    const values = this.form.getRawValue();
    this.loading = true;
    this.getSaveQuery(values)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(item => {
        this.onCompanySaved(item);
        this.openSnackBar('Saved');
      }, err => this.openSnackBar('Error while saving'));
  }

  onCompanySaved(company: Company) {
    if (this.company) {
      this.company = company;
      this.setFormValues(company);
    } else {
      this.router.navigate([company.id], { relativeTo: this.route });
    }
  }

  loadCompanies(id?: string) {
    this.dataService.get(Company)
      .subscribe(
        data => this.companyList = data.filter(x => id ? x.id !== id : true)
      );
  }

  loadUsers(companyId: string) {
    this.dataService.httpClient.get(`api/users/${companyId}`)
      .subscribe(
        data => this.userList = <any[]>data
      );
  }

  getRecordId(): Observable<string | null> {
    return this.route.params.pipe(map(params => params.id));
  }

  loadCompany(recordId: string): Observable<Company> {
    if (!recordId) {
      return of(null);
    }
    this.loading = true;
    return this.dataService.getById(Company, recordId)
      .pipe(
        finalize(() => this.loading = false)
      );
  }

  setFormValues(company: Company) {
    this.company = company;
    if (!company) {
      return;
    }
    this.form.patchValue({
      name: company.name,
      parentId: company.parentId,
      code: company.code,
      email: company.email,
      phone: company.phone,
      address: company.address,
      active: company.active,
    });
  }

}

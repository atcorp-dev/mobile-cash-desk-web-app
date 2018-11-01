import { Item } from './../../models/item.model';
import { finalize, map, switchMap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl } from '@angular/forms';
import { ItemDataService } from '../../services/item-data.service';
import { CompanyDataService } from 'src/app/company/services/company-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { Company } from 'src/app/company/models/company.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-item-page',
  templateUrl: './item-page.component.html',
  styleUrls: ['./item-page.component.css'],
  providers: [
    ItemDataService,
    CompanyDataService
  ]
})
export class ItemPageComponent implements OnInit {

  form: FormGroup;
  companyList: Array<Company>;
  loading: boolean;
  item: Item;

  get additionalFieldsControls(): AbstractControl[] {
    return this.form && (<FormArray>(this.form.controls.additionalFields)).controls;
  }

  constructor(
    private formBuilder: FormBuilder,
    private dataService: ItemDataService,
    private companyService: CompanyDataService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private location: Location
  ) { }

  ngOnInit() {
    this.createForm();
    this.loadCompanies();
    this.getRecordId().pipe(
      switchMap(id => this.loadItem(id))
    ).subscribe(item => this.setFormValues(item));
  }

  openSnackBar(message: string, action?: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  createForm() {
    this.form = this.formBuilder.group({
      name: [null, [Validators.required]],
      companyId: [null, [Validators.required]],
      code: [null, [Validators.required]],
      barCode: null,
      price: [null, [Validators.required, Validators.min(0.01)]],
      description: null,
      additionalFields: this.formBuilder.array([
        this.getAdditionalFieldsControls()
      ])
    });
  }

  getAdditionalFieldsControls(values?): FormGroup {
    const group = this.formBuilder.group({
      name: [null, [Validators.required]],
      value: [null, [Validators.required]],
    });
    if (values) {
      group.patchValue(values);
    }
    return group;
  }

  addAdditionalFieldsControl() {
    const additionalFields: FormArray = <FormArray>this.form.controls.additionalFields;
    const control = this.getAdditionalFieldsControls();
    additionalFields.controls.push(control);
  }

  cancel() {
    this.location.back();
  }

  getSaveQuery(values): Observable<any> {
    return this.item
      ? this.dataService.modifyItem(this.item.id, values)
      : this.companyService.createItem(values);
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
        this.onItemSaved(item);
        this.openSnackBar('Saved');
      }, err => this.openSnackBar('Error while saving'));
  }

  onItemSaved(item: Item) {
    if (this.item) {
      this.item = item;
      this.setFormValues(item);
    } else {
      this.router.navigate([item.id], { relativeTo: this.route });
    }
  }

  loadCompanies() {
    this.companyService.get(Company)
      .subscribe(
        data => this.companyList = data
      );
  }

  getRecordId(): Observable<string|null> {
    return this.route.params.pipe(map(params => params.id));
  }

  loadItem(recordId: string): Observable<Item> {
    this.loading = true;
    return this.dataService.getById(Item, recordId)
      .pipe(
        finalize(() => this.loading = false)
      );
  }

  setFormValues(item: Item) {
    this.item = item;
    this.form.patchValue({
      name: item.name,
      companyId: item.companyId,
      code: item.code,
      barCode: item.barCode,
      price: item.price,
      description: item.description,
    });
    const controls = (item.additionalFields || []).map(f => this.getAdditionalFieldsControls(f));
    this.form.controls.additionalFields = this.formBuilder.array(controls);
  }

}

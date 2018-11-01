import { InventoryDataService } from './../../services/inventory-data.service';
import { Company } from './../../../company/models/company.model';
import { CompanyDataService } from './../../../company/services/company-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemDataService } from './../../services/item-data.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Item } from './../../models/item.model';
import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css'],
  providers: [
    ItemDataService,
    CompanyDataService,
    InventoryDataService
  ]
})
export class ItemListComponent implements OnInit {

  displayedColumns: string[] = ['name', 'barCode', 'code', 'price', 'company', 'image', 'menu'];
  dataSource: Array<Item> = [];
  companyList: Array<Company>;
  form: FormGroup;
  uploadForm: FormGroup;
  searchForm: FormGroup;
  addButtonDisabled: boolean;
  uploadButtonDisabled: boolean;
  uploadImageButtonDisabled: boolean;
  loading: boolean;

  get makeImportButtonDisabled(): boolean {
    return !this.makeImportButtonEnabled;
  }

  get makeImportButtonEnabled(): boolean {
    const companyId = this.searchForm && this.searchForm.value.companyId;
    const company = this.companyList && this.companyList.find(c => c.id === companyId);
    return company && company.extras && company.extras.integrationConfig;
  }

  constructor(
    private formBuilder: FormBuilder,
    private dataService: ItemDataService,
    private companyService: CompanyDataService,
    private inventoryService: InventoryDataService,
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
      companyId: [null, [Validators.required]],
      name: [null, [Validators.required]],
      code: [null, [Validators.required]],
      barCode: [null, [Validators.required]],
      price: [null, [Validators.required, Validators.min(0.01)]],
      image: null,
      description: null,
    });
    this.uploadForm = this.formBuilder.group({
      companyId: [null, [Validators.required]],
      file: [null, [Validators.required]],
    });
    this.searchForm = this.formBuilder.group({
      companyId: null
    });
    this.searchForm.get('companyId').valueChanges.subscribe(() => this.loadItems());
  }

  loadCompanies() {
    this.companyService.get(Company)
    .subscribe(
      data => this.companyList = data
    );
  }

  loadItems() {
    const companyId = this.searchForm.get('companyId').value;
    this.loading = true;
    const params = companyId ? { companyId } : undefined;
    this.dataService.get(Item, params)
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe(
        data => this.dataSource = data
      );
  }

  openEditPage(id) {
    this.router.navigate(['..', 'item', id], { relativeTo: this.route });
  }

  create() {
    this.loading = true;
    this.addButtonDisabled = true;
    this.companyService.createItem(
      this.form.value
    )
      .pipe(
        finalize(() => {
          this.loading = false;
          this.addButtonDisabled = false;
        })
      )
      .subscribe(item => {
        this.form.reset();
        this.searchForm.patchValue({ companyId: item.companyId });
        this.loadItems();
        this.addButtonDisabled = false;
        this.openSnackBar('Saved');
      }, err => this.openSnackBar('Error while saving'));
  }

  remove(id: string) {
    this.loading = true;
    this.dataService.delete(id)
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe(success => {
        if (success) {
          this.loadItems();
          this.openSnackBar('Removed');
        } else {
          this.openSnackBar('Item can not be deleted');
        }
      });
  }

  selectImageFile(event) {
    this.uploadImageButtonDisabled = true;
    const fileList: FileList = event.target.files;
    if (!fileList.length) {
      this.uploadImageButtonDisabled = false;
      return;
    }
    const file = fileList[0];
    this.getBase64(file).subscribe(
      value => this.form.patchValue({ image: value })
    );
  }

  selectFile(event) {
    this.uploadButtonDisabled = true;
    const fileList: FileList = event.target.files;
    if (!fileList.length) {
      return;
    }
    const file = fileList[0];
    this.uploadForm.patchValue({ file });
  }

  uploadCSV() {
    const { companyId, file } = this.uploadForm.value;
    const company = this.companyList.find(i => i.id === companyId).code;
    this.loading = true;
    this.inventoryService.importCsv(company, file)
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe(() => {
        this.loadItems();
        this.uploadButtonDisabled = false;
        this.openSnackBar('Imported');
        this.uploadForm.reset();
      });
  }

  getBase64(file: File): Observable<string> {
    return Observable.create(observer => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => observer.next(reader.result);
      reader.onerror = error => observer.error(error);
    });
  }

  makeImport() {
    const companyId = this.searchForm && this.searchForm.value.companyId;
    this.loading = true;
    this.inventoryService.makeImport(companyId).subscribe(
      res => {
        this.loading = false;
        this.openSnackBar('Imported');
        this.loadItems();
      },
      err => {
        this.loading = false;
        this.openSnackBar('Error while make import');
      }
    );
  }

  onAddButtonClick() {
    this.router.navigate(['/item']);
  }

}

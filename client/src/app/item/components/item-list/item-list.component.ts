import { InventoryDataService } from './../services/inventory-data.service';
import { Company } from './../../../company/models/company.model';
import { CompanyDataService } from './../../../company/services/company-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemDataService } from './../services/item-data.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Item } from './../../models/item.model';
import { Component, OnInit } from '@angular/core';

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

  displayedColumns: string[] = ['name', 'code', 'price', 'company', 'menu'];
  dataSource: Array<Item> = [];
  companyList: Array<Company>;
  form: FormGroup;
  addButtonDisabled: boolean;
  uploadButtonDisabled: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private dataService: ItemDataService,
    private companyService: CompanyDataService,
    private inventoryService: InventoryDataService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadCompanies();
    this.loadItems();
    this.createForm();
  }

  createForm() {
    this.form = this.formBuilder.group({
      companyId: [null, [Validators.required]],
      name: [null, [Validators.required]],
      code: [null, [Validators.required]],
      price: [null, [Validators.required, Validators.min(0.01)]],
      description: null,
    });
  }

  loadCompanies() {
    this.companyService.get(Company).subscribe(
      data => this.companyList = data
    );
  }

  loadItems() {
    this.dataService.get(Item).subscribe(
      data => this.dataSource = data
    );
  }

  openEditPage(id) {
    this.router.navigate(['..', 'item', id], { relativeTo: this.route });
  }

  create() {
    this.addButtonDisabled = true;
    this.companyService.createItem(
      this.form.value
    ).subscribe(() => {
      this.form.reset();
      this.loadItems();
      this.addButtonDisabled = false;
    });
  }

  uploadCSV(event: any) {
    this.uploadButtonDisabled = true;
    const fileList: FileList = event.target.files;
    if (!fileList.length) {
      return;
    }
    const file = fileList[0];
    this.inventoryService.importCsv(file)
    .subscribe(() => {
      this.loadItems();
      this.uploadButtonDisabled = false;
    });
  }

}

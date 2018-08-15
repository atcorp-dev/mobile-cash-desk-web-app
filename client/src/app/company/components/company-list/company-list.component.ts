import { DataService } from './../../../core/services/data.service';
import { Component, OnInit } from '@angular/core';
import { Company } from '../../models/company.model';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-company',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.css'],
  providers: [DataService]
})
export class CompanyListComponent implements OnInit {

  displayedColumns: string[] = ['name', 'code', 'email', 'phone'];
  dataSource: Array<Company> = [];

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.dataService.get(Company).subscribe(
      data => this.dataSource = data
    );
  }

  openEditPage(id) {
    this.router.navigate(['..', 'company', id], { relativeTo: this.route });
  }

}

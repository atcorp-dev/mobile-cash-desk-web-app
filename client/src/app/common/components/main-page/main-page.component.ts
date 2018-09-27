import { AppService } from './../../../app.service';
import { AuthService } from './../../../auth/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {

  loading: boolean;

  constructor(private authService: AuthService, private appService: AppService) { }

  ngOnInit() {
    this.getCurrentUser();
  }

  getCurrentUser() {
    this.loading = true;
    const finalize = () => this.loading = false;
    this.authService.getCurrentUser()
    .subscribe(user => {
      this.appService.currentUser = user;
      finalize();
    }, finalize, finalize);
  }

}

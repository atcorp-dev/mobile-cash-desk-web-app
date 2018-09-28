import { AuthService } from './../../auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppService } from './../../../app.service';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  loading: boolean;
  form: FormGroup;

  constructor(
    private appService: AppService,
    private authService: AuthService,
    private fb: FormBuilder,
    private location: Location
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
  }

  onLogin() {
    const { username, password } = this.form.value;
    this.loading = true;
    this.authService.authorize(username, password)
      .subscribe(
        user => {
          this.loading = false;
          this.appService.currentUser = user;
          this.location.back();
        },
        e => this.loading = false
      );
  }

}

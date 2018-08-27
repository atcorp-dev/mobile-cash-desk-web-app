import { AngularMaterialModule } from './../angular-material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { LoadingModule } from 'ngx-loading';

@NgModule({
  exports: [
    AngularMaterialModule,
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    LoadingModule
  ]
})
export class AppCoreModule { }

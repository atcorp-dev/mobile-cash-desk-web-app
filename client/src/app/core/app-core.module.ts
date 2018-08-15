import { AngularMaterialModule } from './../angular-material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  exports: [
    AngularMaterialModule,
    CommonModule,
    HttpClientModule
  ]
})
export class AppCoreModule { }

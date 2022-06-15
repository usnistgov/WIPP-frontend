import { NgModule } from '@angular/core';
import {DynamicContentComponent} from '../dynamic-content/dynamic-content.component';
import {CommonModule} from '@angular/common';
import {DynamicContentModule} from '../dynamic-content/dynamic-content.module';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ]
})
export class JobModule { }

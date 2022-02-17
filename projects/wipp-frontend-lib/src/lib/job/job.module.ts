import { NgModule } from '@angular/core';
import {DynamicContentComponent} from '../dynamic-content/dynamic-content.component';
import {CommonModule} from '@angular/common';
import {DynamicContentModule} from '../dynamic-content/dynamic-content.module';
import { HttpClientModule } from '@angular/common/http';
import { JobFormComponent } from './job-form/job-form.component';


@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  declarations: [JobFormComponent]
})
export class JobModule { }

import { NgModule } from '@angular/core';
import {DynamicContentComponent} from '../dynamic-content/dynamic-content.component';
import {CommonModule} from '@angular/common';


@NgModule({
  imports: [
    CommonModule
  ],
  entryComponents: [DynamicContentComponent],
  declarations: [
    DynamicContentComponent
  ]
})
export class JobModule { }

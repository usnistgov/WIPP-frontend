import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WdztDirective } from './wdzt.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [WdztDirective],
  exports: [
    WdztDirective
  ]
})
export class WdztModule { }

import {NgModule} from '@angular/core';
import {DynamicContentComponent} from './dynamic-content.component';
import {CommonModule} from '@angular/common';
import {UnknownDynamicComponent} from './unknown-dynamic.component';

@NgModule({
    imports: [
      CommonModule,
    ],
    declarations: [
      DynamicContentComponent, UnknownDynamicComponent
    ],
    exports: [
      DynamicContentComponent
    ]
})
export class DynamicContentModule { }

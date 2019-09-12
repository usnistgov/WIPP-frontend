import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgMathPipesModule} from 'angular-pipes';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {
  MatPaginatorModule, MatProgressSpinnerModule, MatSortModule,
  MatTableModule, MatCheckboxModule, MatFormFieldModule, MatInputModule
} from '@angular/material';
import {FormsModule} from '@angular/forms';
import {InlineEditorModule} from '@qontu/ngx-inline-editor';
import {PyramidRoutingModule} from './pyramid-routing.module';
import {PyramidListComponent} from './pyramid-list/pyramid-list.component';
import {PyramidDetailComponent} from './pyramid-detail/pyramid-detail.component';
import {WdztModule} from '../wdzt/wdzt.module';
import {PyramidTemplateComponent} from './pyramid-template/pyramid-template.component';

@NgModule({
  imports: [
    CommonModule,
    NgbModule.forRoot(),
    NgMathPipesModule,
    PyramidRoutingModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    InlineEditorModule,
    MatCheckboxModule,
    WdztModule
  ],
  declarations: [
    PyramidDetailComponent,
    PyramidListComponent,
    PyramidTemplateComponent
  ]
})
export class PyramidModule {
}

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgMathPipesModule} from 'angular-pipes';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import {FormsModule} from '@angular/forms';
// import {InlineEditorModule} from '@qontu/ngx-inline-editor';
import {PyramidListComponent} from './pyramid-list/pyramid-list.component';
import {PyramidDetailComponent} from './pyramid-detail/pyramid-detail.component';
import {WdztModule} from '../wdzt/wdzt.module';
import {PyramidTemplateComponent} from './pyramid-template/pyramid-template.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    NgMathPipesModule,
    RouterModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    // InlineEditorModule,
    MatCheckboxModule,
    WdztModule,
    HttpClientModule
  ],
  declarations: [
    PyramidDetailComponent,
    PyramidListComponent,
    PyramidTemplateComponent
  ]
})
export class PyramidModule {
}

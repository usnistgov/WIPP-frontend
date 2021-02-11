import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PyramidAnnotationTemplateComponent } from './pyramid-annotation-template/pyramid-annotation-template.component';
import { PyramidAnnotationListComponent } from './pyramid-annotation-list/pyramid-annotation-list.component';
import { PyramidAnnotationDetailComponent } from './pyramid-annotation-detail/pyramid-annotation-detail.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import {FormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    PyramidAnnotationTemplateComponent,
    PyramidAnnotationListComponent,
    PyramidAnnotationDetailComponent],
  imports: [
    CommonModule,
    RouterModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatInputModule,
    NgbModule,
    FormsModule,
    HttpClientModule
  ]
})
export class PyramidAnnotationModule { }

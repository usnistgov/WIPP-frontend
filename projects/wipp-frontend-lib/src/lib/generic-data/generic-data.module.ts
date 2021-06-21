import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenericDataListComponent } from './generic-data-list/generic-data-list.component';
import { GenericDataDetailComponent } from './generic-data-detail/generic-data-detail.component';
import { GenericDataTemplateComponent } from './generic-data-template/generic-data-template.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { GenericDataNewComponent } from './generic-data-new/generic-data-new.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgMathPipesModule } from 'angular-pipes';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    HttpClientModule,
    NgbModule,
    FormsModule,
    NgMathPipesModule
  ],
  entryComponents: [
    GenericDataNewComponent
  ],
  declarations: [
    GenericDataListComponent,
    GenericDataDetailComponent,
    GenericDataTemplateComponent,
    GenericDataNewComponent
  ]
})
export class GenericDataModule { }

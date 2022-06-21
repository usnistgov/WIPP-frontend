import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenericDataCollectionListComponent } from './generic-data-collection-list/generic-data-collection-list.component';
import { GenericDataCollectionDetailComponent } from './generic-data-collection-detail/generic-data-collection-detail.component';
import { GenericDataCollectionTemplateComponent } from './generic-data-collection-template/generic-data-collection-template.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { GenericDataCollectionNewComponent } from './generic-data-collection-new/generic-data-collection-new.component';
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
    GenericDataCollectionNewComponent
  ],
  declarations: [
    GenericDataCollectionListComponent,
    GenericDataCollectionDetailComponent,
    GenericDataCollectionTemplateComponent,
    GenericDataCollectionNewComponent
  ]
})
export class GenericDataCollectionModule { }

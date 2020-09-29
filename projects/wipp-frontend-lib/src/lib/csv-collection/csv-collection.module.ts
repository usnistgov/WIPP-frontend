import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CsvCollectionListComponent } from './csv-collection-list/csv-collection-list.component';
import { CsvCollectionDetailComponent } from './csv-collection-detail/csv-collection-detail.component';
import {MatFormFieldModule, MatInputModule, MatPaginatorModule, MatSortModule, MatTableModule} from '@angular/material';
import {CsvCollectionRoutingModule} from './csv-collection-routing.module';
import { CsvCollectionTemplateComponent } from './csv-collection-template/csv-collection-template.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { CsvCollectionNewComponent } from './csv-collection-new/csv-collection-new.component';
import { FormsModule } from '@angular/forms';
import {NgMathPipesModule} from 'angular-pipes';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    CsvCollectionRoutingModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    NgbModule.forRoot(),
    FormsModule,
    NgMathPipesModule,
    HttpClientModule
  ],
  entryComponents: [
    CsvCollectionNewComponent
  ],
  declarations: [
    CsvCollectionListComponent,
    CsvCollectionDetailComponent,
    CsvCollectionTemplateComponent,
    CsvCollectionNewComponent
  ]
})
export class CsvCollectionModule { }

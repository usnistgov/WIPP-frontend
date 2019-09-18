import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CsvCollectionListComponent } from './csv-collection-list/csv-collection-list.component';
import { CsvCollectionDetailComponent } from './csv-collection-detail/csv-collection-detail.component';
import {MatFormFieldModule, MatInputModule, MatPaginatorModule, MatSortModule, MatTableModule} from '@angular/material';
import {CsvCollectionRoutingModule} from './csv-collection-routing.module';
import { CsvCollectionTemplateComponent } from './csv-collection-template/csv-collection-template.component';

@NgModule({
  imports: [
    CommonModule,
    CsvCollectionRoutingModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule
  ],
  declarations: [CsvCollectionListComponent, CsvCollectionDetailComponent, CsvCollectionTemplateComponent]
})
export class CsvCollectionModule { }

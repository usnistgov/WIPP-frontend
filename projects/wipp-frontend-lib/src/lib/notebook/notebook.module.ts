import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import {FormsModule} from '@angular/forms';
import { NotebookListComponent } from './notebook-list/notebook-list.component';
import { NotebookDetailComponent } from './notebook-detail/notebook-detail.component';
import {NotebookTemplateComponent} from './notebook-template/notebook-template.component';
import {NgxSpinnerModule} from 'ngx-spinner';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    RouterModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatInputModule,
    FormsModule,
    MatCheckboxModule,
    NgxSpinnerModule,
    HttpClientModule
  ],
  declarations: [
    NotebookListComponent,
    NotebookDetailComponent,
    NotebookTemplateComponent
  ]
})

export class NotebookModule { }

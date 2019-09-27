import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {MatCheckboxModule, MatInputModule, MatPaginatorModule, MatSortModule, MatTableModule} from '@angular/material';
import {FormsModule} from '@angular/forms';
import {NotebookRoutingModule} from './notebook-routing.module';
import { NotebookListComponent } from './notebook-list/notebook-list.component';
import { NotebookDetailComponent } from './notebook-detail/notebook-detail.component';
import {NotebookTemplateComponent} from './notebook-template/notebook-template.component';
import {NgxSpinnerModule} from 'ngx-spinner';

@NgModule({
  imports: [
    CommonModule,
    NgbModule.forRoot(),
    NotebookRoutingModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatInputModule,
    FormsModule,
    MatCheckboxModule,
    NgxSpinnerModule
  ],
  declarations: [
    NotebookListComponent,
    NotebookDetailComponent,
    NotebookTemplateComponent
  ]
})

export class NotebookModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenericDataListComponent } from './generic-data-list/generic-data-list.component';
import { GenericDataDetailComponent } from './generic-data-detail/generic-data-detail.component';
import { GenericDataTemplateComponent } from './generic-data-template/generic-data-template.component';
import {MatFormFieldModule, MatInputModule, MatPaginatorModule, MatSortModule, MatTableModule} from '@angular/material';
import {GenericDataRoutingModule} from './generic-data-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { GenericDataNewComponent } from './generic-data-new/generic-data-new.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgMathPipesModule } from 'angular-pipes';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    GenericDataRoutingModule,
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

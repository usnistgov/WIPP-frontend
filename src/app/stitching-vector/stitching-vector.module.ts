import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NgMathPipesModule} from 'angular-pipes';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSortModule,
  MatTableModule,
  MatCheckboxModule,
  MatFormFieldModule, MatInputModule
} from '@angular/material';
import {FormsModule} from '@angular/forms';
import {InlineEditorModule} from '@qontu/ngx-inline-editor';
import {StitchingVectorNewComponent} from './stitching-vector-new/stitching-vector-new.component';
import {StitchingVectorListComponent} from './stitching-vector-list/stitching-vector-list.component';
import {StitchingVectorDetailComponent} from './stitching-vector-detail/stitching-vector-detail.component';
import {StitchingVectorRoutingModule} from './stitching-vector-routing.module';


@NgModule({
  imports: [
    CommonModule,
    NgbModule.forRoot(),
    NgMathPipesModule,
    StitchingVectorRoutingModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    InlineEditorModule,
    MatCheckboxModule
  ],
  entryComponents: [StitchingVectorNewComponent],
  declarations: [
    StitchingVectorDetailComponent,
    StitchingVectorListComponent,
    StitchingVectorNewComponent
  ]
})
export class StitchingVectorModule { }

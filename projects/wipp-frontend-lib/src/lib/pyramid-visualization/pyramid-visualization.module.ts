import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PyramidVisualizationListComponent } from './pyramid-visualization-list/pyramid-visualization-list.component';
import { PyramidVisualizationDetailComponent } from './pyramid-visualization-detail/pyramid-visualization-detail.component';
import { PyramidVisualizationNewComponent } from './pyramid-visualization-new/pyramid-visualization-new.component';
import { PyramidVisualizationHelpComponent } from './pyramid-visualization-help/pyramid-visualization-help.component';
import {WdztModule} from '../wdzt/wdzt.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {MatFormFieldModule, MatInputModule, MatPaginatorModule, MatSortModule, MatTableModule} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    WdztModule,
    NgbModule
  ],
  entryComponents: [
    PyramidVisualizationNewComponent,
    PyramidVisualizationHelpComponent
  ]
  ,
  declarations: [
    PyramidVisualizationListComponent,
    PyramidVisualizationDetailComponent,
    PyramidVisualizationNewComponent,
    PyramidVisualizationHelpComponent],

})
export class PyramidVisualizationModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TensorflowModelListComponent } from './tensorflow-model-list/tensorflow-model-list.component';
import { TensorflowModelDetailComponent } from './tensorflow-model-detail/tensorflow-model-detail.component';
import {TensorflowModelRoutingModule} from './tensorflow-model-routing.module';
import {MatFormFieldModule, MatInputModule, MatPaginator, MatPaginatorModule, MatSortModule, MatTableModule} from '@angular/material';
import {TensorflowModelTemplateComponent} from './tensorflow-model-template/tensorflow-model-template.component';
import { TensorboardLogsTemplateComponent } from './tensorflow-model-template/tensorboard-logs-template.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    TensorflowModelRoutingModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    HttpClientModule
  ],
  declarations: [TensorflowModelListComponent,
    TensorflowModelDetailComponent,
    TensorflowModelTemplateComponent,
    TensorboardLogsTemplateComponent
  ]
})
export class TensorflowModelModule { }

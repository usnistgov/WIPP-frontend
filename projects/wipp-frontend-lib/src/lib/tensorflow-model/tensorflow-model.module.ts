import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TensorflowModelListComponent } from './tensorflow-model-list/tensorflow-model-list.component';
import { TensorflowModelDetailComponent } from './tensorflow-model-detail/tensorflow-model-detail.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import {TensorflowModelTemplateComponent} from './tensorflow-model-template/tensorflow-model-template.component';
import { TensorboardLogsTemplateComponent } from './tensorflow-model-template/tensorboard-logs-template.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
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

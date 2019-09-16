import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TensorflowModelDetailComponent} from './tensorflow-model-detail/tensorflow-model-detail.component';
import {TensorflowModelListComponent} from './tensorflow-model-list/tensorflow-model-list.component';

const tensorflowModelsRoutes: Routes = [
  { path: 'tensorflow-models', component: TensorflowModelListComponent },
  { path: 'tensorflow-models/:id', component: TensorflowModelDetailComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(tensorflowModelsRoutes)
  ],
  exports: [
    RouterModule
  ]
})

export class TensorflowModelRoutingModule {}

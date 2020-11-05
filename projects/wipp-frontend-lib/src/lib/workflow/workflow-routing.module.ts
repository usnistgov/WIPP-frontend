import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {WorkflowListComponent} from './workflow-list/workflow-list.component';
import {WorkflowDetailComponent} from './workflow-detail/workflow-detail.component';

const workflowsRoutes: Routes = [
  { path: 'workflows', component: WorkflowListComponent },
  { path: 'workflows/detail/:id', component: WorkflowDetailComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(workflowsRoutes)
  ],
  exports: [
    RouterModule
  ]
})

export class WorkflowRoutingModule {}

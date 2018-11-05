import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {WorkflowListComponent} from './workflow-list/workflow-list.component';
import {WorkflowCreateComponent} from './workflow-create/workflow-create.component';

const workflowsRoutes: Routes = [
  { path: 'workflows', component: WorkflowListComponent },
  { path: 'workflows/create/:id', component: WorkflowCreateComponent }
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

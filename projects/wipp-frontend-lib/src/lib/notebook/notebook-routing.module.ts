import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {NotebookListComponent} from './notebook-list/notebook-list.component';
import {NotebookDetailComponent} from './notebook-detail/notebook-detail.component';

const notebooksRoutes: Routes = [
  { path: 'notebooks', component: NotebookListComponent },
  { path: 'notebooks/:id', component: NotebookDetailComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(notebooksRoutes),
  ],
  exports: [
    RouterModule
  ]
})

export class NotebookRoutingModule {}

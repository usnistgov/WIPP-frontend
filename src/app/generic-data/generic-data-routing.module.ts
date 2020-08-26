import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {GenericDataListComponent} from './generic-data-list/generic-data-list.component';
import {GenericDataDetailComponent} from './generic-data-detail/generic-data-detail.component';

const genericDatasRoutes: Routes = [
  { path: 'generic-datas', component: GenericDataListComponent },
  { path: 'generic-datas/:id', component: GenericDataDetailComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(genericDatasRoutes)
  ],
  exports: [
    RouterModule
  ]
})

export class GenericDataRoutingModule {}

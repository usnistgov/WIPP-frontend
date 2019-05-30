import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PyramidListComponent} from './pyramid-list/pyramid-list.component';
import {PyramidDetailComponent} from './pyramid-detail/pyramid-detail.component';

const pyramidRoutes: Routes = [
  { path: 'pyramids', component: PyramidListComponent },
  { path: 'pyramids/:id', component: PyramidDetailComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(pyramidRoutes)
  ],
  exports: [
    RouterModule
  ]
})

export class PyramidRoutingModule {}

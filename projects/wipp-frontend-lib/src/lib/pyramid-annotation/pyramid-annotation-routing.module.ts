import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PyramidAnnotationListComponent} from './pyramid-annotation-list/pyramid-annotation-list.component';
import {PyramidAnnotationDetailComponent} from './pyramid-annotation-detail/pyramid-annotation-detail.component';

const pyramidAnnotationsRoutes: Routes = [
  { path: 'pyramid-annotations', component: PyramidAnnotationListComponent },
  { path: 'pyramid-annotations/:id', component: PyramidAnnotationDetailComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(pyramidAnnotationsRoutes)
  ],
  exports: [
    RouterModule
  ]
})

export class PyramidAnnotationRoutingModule { }

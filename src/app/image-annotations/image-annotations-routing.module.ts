import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {ImageAnnotationsListComponent} from './image-annotations-list/image-annotations-list.component';
import {ImageAnnotationsDetailComponent} from './image-annotations-detail/image-annotations-detail.component';

const imageAnnotationsRoutes: Routes = [
  { path: 'image-annotations', component: ImageAnnotationsListComponent },
  { path: 'image-annotations/:id', component: ImageAnnotationsDetailComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(imageAnnotationsRoutes)
  ],
  exports: [
    RouterModule
  ]
})

export class ImageAnnotationsRoutingModule {}

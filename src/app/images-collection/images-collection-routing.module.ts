import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ImagesCollectionListComponent } from './images-collection-list/images-collection-list.component';
import { ImagesCollectionDetailComponent } from './images-collection-detail/images-collection-detail.component';

const imagesCollectionsRoutes: Routes = [
  { path: 'images-collections', component: ImagesCollectionListComponent },
  { path: 'images-collection/:id', component: ImagesCollectionDetailComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(imagesCollectionsRoutes)
  ],
  exports: [
    RouterModule
  ]
})

export class ImagesCollectionRoutingModule {}

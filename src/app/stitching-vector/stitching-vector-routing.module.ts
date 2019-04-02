import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {StitchingVectorListComponent} from './stitching-vector-list/stitching-vector-list.component';
import {StitchingVectorDetailComponent} from './stitching-vector-detail/stitching-vector-detail.component';

const stitchingVectorRoutes: Routes = [
  { path: 'stitching-vectors', component: StitchingVectorListComponent },
  { path: 'stitching-vectors/:id', component: StitchingVectorDetailComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(stitchingVectorRoutes)
  ],
  exports: [
    RouterModule
  ]
})

export class StitchingVectorRoutingModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PyramidVisualizationListComponent} from './pyramid-visualization-list/pyramid-visualization-list.component';
import {PyramidVisualizationDetailComponent} from './pyramid-visualization-detail/pyramid-visualization-detail.component';

const visualizationRoutes: Routes = [
  { path: 'pyramid-visualizations', component: PyramidVisualizationListComponent },
  { path: 'pyramid-visualizations/:id', component: PyramidVisualizationDetailComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(visualizationRoutes)
  ],
  exports: [
    RouterModule
  ]
})

export class PyramidVisualizationRoutingModule {}


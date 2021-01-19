import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CsvCollectionDetailComponent, CsvCollectionListComponent, 
          ImagesCollectionListComponent, ImagesCollectionDetailComponent, 
          StitchingVectorListComponent, StitchingVectorDetailComponent,
          GenericDataDetailComponent, GenericDataListComponent, 
          PyramidListComponent,PyramidDetailComponent,
          PyramidAnnotationDetailComponent, PyramidAnnotationListComponent,
          PyramidVisualizationDetailComponent, PyramidVisualizationListComponent,
          TensorflowModelListComponent, TensorflowModelDetailComponent,
          NotebookListComponent, NotebookDetailComponent, 
          PluginListComponent, PluginDetailComponent, 
          WorkflowListComponent, WorkflowDetailComponent, 
          PageNotFoundComponent } from 'wipp-frontend-lib';
import { environment } from '../environments/environment';


const appRoutes: Routes = [
    { path: 'images-collections', component: ImagesCollectionListComponent },
    { path: 'images-collections/:id', component: ImagesCollectionDetailComponent },
    { path: 'stitching-vectors', component: StitchingVectorListComponent },
    { path: 'stitching-vectors/:id', component: StitchingVectorDetailComponent },
    { path: 'csv-collections', component: CsvCollectionListComponent },
    { path: 'csv-collections/:id', component: CsvCollectionDetailComponent },
    { path: 'pyramids', component: PyramidListComponent },
    { path: 'pyramids/:id', component: PyramidDetailComponent },
    { path: 'pyramid-annotations', component: PyramidAnnotationListComponent },
    { path: 'pyramid-annotations/:id', component: PyramidAnnotationDetailComponent },
    { path: 'pyramid-visualizations', component: PyramidVisualizationListComponent },
    { path: 'pyramid-visualizations/:id', component: PyramidVisualizationDetailComponent },
    { path: 'tensorflow-models', component: TensorflowModelListComponent },
    { path: 'tensorflow-models/:id', component: TensorflowModelDetailComponent },
    { path: 'notebooks', component: NotebookListComponent },
    { path: 'notebooks/:id', component: NotebookDetailComponent },
    { path: 'generic-datas', component: GenericDataListComponent },
    { path: 'generic-datas/:id', component: GenericDataDetailComponent },
    { path: 'plugins', component: PluginListComponent },
    { path: 'plugins/:id', component: PluginDetailComponent },
    { path: 'workflows', component: WorkflowListComponent },
    { path: 'workflows/detail/:id', component: WorkflowDetailComponent },
    { path: '',   redirectTo: '/images-collections', pathMatch: 'full' },
    { path: '**', component: PageNotFoundComponent },
  ];
  
  @NgModule({
    imports: [
      RouterModule.forRoot(
        appRoutes,
        { enableTracing: environment.enableTracing } // <-- debugging purposes only
      )],
    exports: [
      RouterModule
    ]
  })
  
  export class AppRoutingModule {}
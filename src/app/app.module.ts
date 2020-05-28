import { BrowserModule } from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';
import { AppComponent } from './app.component';

import { PageNotFoundComponent } from './not-found/not-found.component';
import { AppRoutingModule } from './app-routing.module';
import { ImagesCollectionModule } from './images-collection/images-collection.module';
import { PluginModule } from './plugin/plugin.module';
import {HttpClientModule} from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatTableModule} from '@angular/material/table';
import {MatInputModule, MatPaginatorModule, MatProgressSpinnerModule, MatSortModule} from '@angular/material';
import {FormsModule} from '@angular/forms';
import {WorkflowModule} from './workflow/workflow.module';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {StitchingVectorModule} from './stitching-vector/stitching-vector.module';
import {PyramidModule} from './pyramid/pyramid.module';
import {TensorflowModelModule} from './tensorflow-model/tensorflow-model.module';
import {CsvCollectionModule} from './csv-collection/csv-collection.module';
import {UnknownDynamicComponent } from './dynamic-content/unknown-dynamic.component';
import {NotebookModule} from './notebook/notebook.module';
import {AppConfigService} from './app-config.service';
import {appInitializerFactory} from './app-init-factory';
import {PyramidVisualizationModule} from './pyramid-visualization/pyramid-visualization.module';
import {PyramidAnnotationModule} from './pyramid-annotation/pyramid-annotation.module';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    UnknownDynamicComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ImagesCollectionModule,
    StitchingVectorModule,
    PyramidAnnotationModule,
    PyramidModule,
    PyramidVisualizationModule,
    TensorflowModelModule,
    CsvCollectionModule,
    NotebookModule,
    PluginModule,
    WorkflowModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    FormsModule,
    MatCheckboxModule,
    NgbModule.forRoot()
  ],
  providers: [
    AppConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFactory,
      multi: true,
      deps: [AppConfigService]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

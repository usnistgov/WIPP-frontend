import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, Injectable, NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import {
  WippFrontendLibModule, GenericDataModule, ImagesCollectionModule,
  CsvCollectionModule, DynamicContentModule, NotebookModule,
  TensorflowModelModule, PluginModule, PyramidModule, PyramidAnnotationModule,
  PyramidVisualizationModule, StitchingVectorModule, WorkflowModule,
  WippFrontendLibConfigurationProvider, WippFrontendLibConfiguration
} from 'wipp-frontend-lib';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { MatInputModule, MatTableModule, MatPaginatorModule, MatSortModule, MatProgressSpinnerModule, MatCheckboxModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppConfigService } from './app-config.service';
import { appInitializerFactory } from './app-init-factory';

@Injectable({ providedIn: 'root' })
export class ConfigFromApp implements WippFrontendLibConfigurationProvider {
  constructor(private appConfig: AppConfigService) { }

  get config(): WippFrontendLibConfiguration {
    return this.appConfig.getConfig();
  }
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    WippFrontendLibModule.forRoot(
      environment.apiRootUrl,
      {
        config: {
          provide: WippFrontendLibConfigurationProvider,
          useClass: ConfigFromApp
        }
      }),
    DynamicContentModule,
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
    GenericDataModule,
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
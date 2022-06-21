import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, Injectable, NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import {
  WippFrontendLibModule, GenericDataCollectionModule, ImagesCollectionModule,
  CsvCollectionModule, DynamicContentModule, NotebookModule,
  TensorflowModelModule, PluginModule, PyramidModule, PyramidAnnotationModule,
  PyramidVisualizationModule, StitchingVectorModule, WorkflowModule,
  ConfirmDialogModule, ConfirmDialogService,
  WippFrontendLibConfigurationProvider, WippFrontendLibConfiguration,
  KeycloakInterceptorService, KeycloakService
} from 'wipp-frontend-lib';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatSidenavModule } from '@angular/material/sidenav';
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
      environment,
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
    GenericDataCollectionModule,
    PluginModule,
    WorkflowModule,
    ConfirmDialogModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    FormsModule,
    MatCheckboxModule,
    NgbModule
  ],
  providers: [
    AppConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFactory,
      multi: true,
      deps: [AppConfigService]
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: KeycloakInterceptorService,
      multi: true
    },
    KeycloakService,    
    ConfirmDialogService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkflowListComponent } from './workflow-list/workflow-list.component';
import {MatInputModule, MatPaginatorModule, MatSortModule, MatTableModule} from '@angular/material';
import {WorkflowRoutingModule} from './workflow-routing.module';
import { WorkflowDetailComponent } from './workflow-detail/workflow-detail.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {SchemaFormModule, WidgetRegistry} from 'ngx-schema-form';
import {SearchWidgetComponent} from './widgets/search-widget/search-widget.component';
import {WidgetsRegistry} from './widgets/widgets-registry';
import { WorkflowNewComponent } from './workflow-new/workflow-new.component';
import {JobDetailComponent} from '../job/job-detail/job-detail.component';
import {NgxGraphModule} from '@swimlane/ngx-graph';
import {DynamicComponent} from '../dynamic-content/dynamic.component';
import {DynamicContentComponent} from '../dynamic-content/dynamic-content.component';
import {DynamicContentModule} from '../dynamic-content/dynamic-content.module';
import {NgxSpinnerModule} from 'ngx-spinner';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    WorkflowRoutingModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    DynamicContentModule,
    NgbModule.forRoot(),
    SchemaFormModule.forRoot(),
    NgxGraphModule,
    NgxSpinnerModule,
    HttpClientModule
  ],
  entryComponents: [SearchWidgetComponent, WorkflowNewComponent, JobDetailComponent],
  declarations: [
    WorkflowListComponent,
    WorkflowDetailComponent,
    SearchWidgetComponent,
    JobDetailComponent,
    WorkflowNewComponent],


  providers: [{
    provide: WidgetRegistry,
    useClass: WidgetsRegistry
  }],
})
export class WorkflowModule { }

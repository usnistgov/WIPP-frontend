import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkflowListComponent } from './workflow-list/workflow-list.component';
import {MatPaginatorModule, MatTableModule} from '@angular/material';
import {WorkflowRoutingModule} from './workflow-routing.module';
import { WorkflowCreateComponent } from './workflow-create/workflow-create.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {SchemaFormModule, WidgetRegistry} from 'ngx-schema-form';
import {SearchWidgetComponent} from './widgets/search-widget/search-widget.component';
import {WidgetsRegistry} from './widgets/widgets-registry';
import { WorkflowNewComponent } from './workflow-new/workflow-new.component';

@NgModule({
  imports: [
    CommonModule,
    WorkflowRoutingModule,
    MatPaginatorModule,
    MatTableModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),
    SchemaFormModule.forRoot()
  ],
  entryComponents: [SearchWidgetComponent, WorkflowNewComponent],
  declarations: [
    WorkflowListComponent,
    WorkflowCreateComponent,
    SearchWidgetComponent,
    WorkflowNewComponent],
  providers: [{
    provide: WidgetRegistry,
    useClass: WidgetsRegistry
  }],
})
export class WorkflowModule { }

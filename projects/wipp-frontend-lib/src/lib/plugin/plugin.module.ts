import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {MatCheckboxModule, MatInputModule, MatPaginatorModule, MatSortModule, MatTableModule} from '@angular/material';
import {FormsModule} from '@angular/forms';
import {PluginRoutingModule} from './plugin-routing.module';
import {PluginListComponent} from './plugin-list/plugin-list.component';
import {PluginDetailComponent} from './plugin-detail/plugin-detail.component';
import { PluginNewComponent } from './plugin-new/plugin-new.component';
import {NgxJsonViewerModule} from 'ngx-json-viewer';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    NgbModule.forRoot(),
    PluginRoutingModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatInputModule,
    FormsModule,
    MatCheckboxModule,
    NgxJsonViewerModule,
    HttpClientModule
  ],
  declarations: [
    PluginListComponent,
    PluginDetailComponent,
    PluginNewComponent
  ],
  entryComponents: [
    PluginNewComponent
  ]
})
export class PluginModule { }

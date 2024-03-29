import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ImagesCollectionRoutingModule} from './images-collection-routing.module';
import {ImagesCollectionDetailComponent} from './images-collection-detail/images-collection-detail.component';
import {ImagesCollectionListComponent} from './images-collection-list/images-collection-list.component';
import {NgMathPipesModule} from 'angular-pipes';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSortModule,
  MatTableModule,
  MatCheckboxModule,
  MatLabel, MatFormFieldModule, MatInputModule, MatRadioModule
} from '@angular/material';
import { ImagesCollectionNewComponent } from './images-collection-new/images-collection-new.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {InlineEditorModule} from '@qontu/ngx-inline-editor';
import {
  ImagesCollectionTemplateComponent
} from './images-collection-template/images-collection-template.component';

@NgModule({
  imports: [
    CommonModule,
    NgbModule.forRoot(),
    NgMathPipesModule,
    ImagesCollectionRoutingModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    ReactiveFormsModule,
    InlineEditorModule,
    MatCheckboxModule
  ],
  entryComponents: [ImagesCollectionNewComponent],
  declarations: [
    ImagesCollectionDetailComponent,
    ImagesCollectionListComponent,
    ImagesCollectionNewComponent,
    ImagesCollectionTemplateComponent
  ]
})
export class ImagesCollectionModule { }

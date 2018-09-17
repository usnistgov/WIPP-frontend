import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ImagesCollectionRoutingModule} from './images-collection-routing.module';
import {ImagesCollectionDetailComponent} from './images-collection-detail/images-collection-detail.component';
import {ImagesCollectionListComponent} from './images-collection-list/images-collection-list.component';
import {NgMathPipesModule} from 'angular-pipes';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {MatPaginatorModule, MatProgressSpinnerModule, MatSortModule, MatTableDataSource, MatTableModule} from '@angular/material';
import { ImagesCollectionNewComponent } from './images-collection-new/images-collection-new.component';
import {FormsModule} from '@angular/forms';

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
    FormsModule
  ],
  entryComponents: [ImagesCollectionNewComponent],
  declarations: [
    ImagesCollectionDetailComponent,
    ImagesCollectionListComponent,
    ImagesCollectionNewComponent
  ]
})
export class ImagesCollectionModule { }

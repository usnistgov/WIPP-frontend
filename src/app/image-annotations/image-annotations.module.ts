import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ImageAnnotationsListComponent} from './image-annotations-list/image-annotations-list.component';
import {ImageAnnotationsDetailComponent} from './image-annotations-detail/image-annotations-detail.component';
import {ImageAnnotationsRoutingModule} from './image-annotations-routing.module';
import {TableModule} from 'primeng/table';
import {ToastModule} from 'primeng/toast';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {FieldsetModule} from 'primeng/fieldset';
import {TooltipModule} from 'primeng/tooltip';



@NgModule({
  declarations: [
    ImageAnnotationsListComponent,
    ImageAnnotationsDetailComponent
  ],
  imports: [
    CommonModule,
    ImageAnnotationsRoutingModule,
    TableModule,
    ToastModule,
    ButtonModule,
    InputTextModule,
    FieldsetModule,
    TooltipModule
  ]
})
export class ImageAnnotationsModule { }

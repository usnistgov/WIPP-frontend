import { NgModule } from '@angular/core';
import {DynamicContentComponent} from './dynamic-content.component';
import {CommonModule} from '@angular/common';
import {UnknownDynamicComponent} from '../unknown-dynamic/unknown-dynamic.component';
import {
  StitchingVectorTemplateComponent
} from '../stitching-vector/stitching-vector-template/stitching-vector-template.component';
import {
  ImagesCollectionTemplateComponent
} from '../images-collection/images-collection-template/images-collection-template.component';
import {PyramidTemplateComponent} from '../pyramid/pyramid-template/pyramid-template.component';


@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    DynamicContentComponent],
  entryComponents: [
    UnknownDynamicComponent,
    ImagesCollectionTemplateComponent,
    PyramidTemplateComponent,
    StitchingVectorTemplateComponent
  ],
  exports: [
    DynamicContentComponent
  ]
})
export class DynamicContentModule { }

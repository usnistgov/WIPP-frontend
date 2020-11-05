import {NgModule} from '@angular/core';
import {DynamicContentComponent} from './dynamic-content.component';
import {CommonModule} from '@angular/common';
import {UnknownDynamicComponent} from './unknown-dynamic.component';
import {StitchingVectorTemplateComponent} from '../stitching-vector/stitching-vector-template/stitching-vector-template.component';
import {ImagesCollectionTemplateComponent} from '../images-collection/images-collection-template/images-collection-template.component';
import {PyramidTemplateComponent} from '../pyramid/pyramid-template/pyramid-template.component';
import {TensorflowModelTemplateComponent} from '../tensorflow-model/tensorflow-model-template/tensorflow-model-template.component';
import {TensorboardLogsTemplateComponent} from '../tensorflow-model/tensorflow-model-template/tensorboard-logs-template.component';
import {CsvCollectionTemplateComponent} from '../csv-collection/csv-collection-template/csv-collection-template.component';
import {NotebookTemplateComponent} from '../notebook/notebook-template/notebook-template.component';
import {PyramidAnnotationTemplateComponent} from '../pyramid-annotation/pyramid-annotation-template/pyramid-annotation-template.component';


@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    DynamicContentComponent,
    UnknownDynamicComponent],
  entryComponents: [
    UnknownDynamicComponent,
    ImagesCollectionTemplateComponent,
    PyramidTemplateComponent,
    StitchingVectorTemplateComponent,
    PyramidAnnotationTemplateComponent,
    TensorflowModelTemplateComponent,
    TensorboardLogsTemplateComponent,
    CsvCollectionTemplateComponent,
    NotebookTemplateComponent
  ],
  exports: [
    DynamicContentComponent,
    UnknownDynamicComponent
  ]
})
export class DynamicContentModule { }

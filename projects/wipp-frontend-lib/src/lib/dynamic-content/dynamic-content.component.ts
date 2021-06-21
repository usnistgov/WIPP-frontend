import {
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {UnknownDynamicComponent} from './unknown-dynamic.component';
import {DynamicComponent} from './dynamic.component';
import {ImagesCollectionTemplateComponent} from '../images-collection/images-collection-template/images-collection-template.component'
import {GenericDataTemplateComponent} from '../generic-data/generic-data-template/generic-data-template.component';
import {CsvCollectionTemplateComponent} from '../csv-collection/csv-collection-template/csv-collection-template.component';
import {PyramidTemplateComponent} from '../pyramid/pyramid-template/pyramid-template.component';
import {PyramidAnnotationTemplateComponent} from '../pyramid-annotation/pyramid-annotation-template/pyramid-annotation-template.component';
import {StitchingVectorTemplateComponent} from '../stitching-vector/stitching-vector-template/stitching-vector-template.component';
import {NotebookTemplateComponent} from '../notebook/notebook-template/notebook-template.component';
import {TensorflowModelTemplateComponent} from '../tensorflow-model/tensorflow-model-template/tensorflow-model-template.component';
import { TensorboardLogsTemplateComponent } from '../tensorflow-model/tensorflow-model-template/tensorboard-logs-template.component';


export const entryComponentsMap = {
  'collection': ImagesCollectionTemplateComponent,
  'stitchingVector': StitchingVectorTemplateComponent,
  'csvCollection': CsvCollectionTemplateComponent,
  'pyramid': PyramidTemplateComponent,
  'pyramidAnnotation': PyramidAnnotationTemplateComponent,
  'notebook': NotebookTemplateComponent,
  'tensorflowModel': TensorflowModelTemplateComponent,
  'tensorboardLogs': TensorboardLogsTemplateComponent,
  'genericData': GenericDataTemplateComponent
};

@Component({
  selector: 'app-dynamic-content',
  template: '<div>\n' +
    '  <div #container></div>\n' +
    '</div>\n',
  styleUrls: ['./dynamic-content.component.css']
})
export class DynamicContentComponent implements OnInit, OnDestroy {
  @ViewChild('container', { read: ViewContainerRef , static: true })
  container: ViewContainerRef;

  @Input()
  type: string

  @Input()
  idData: string;

  @Input()
  text: string;

  @Input()
  jobId: string;

  @Input()
  defaultText: string;

  private componentRef: ComponentRef<{}>;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  ngOnInit() {
    let factoryClass;
    for (const [key, value] of Object.entries(entryComponentsMap)) {
      if(this.type === key){
        factoryClass = value;
      }
    }

    if (!factoryClass || !this.idData) {
      factoryClass = UnknownDynamicComponent; 
    }
    
    const factory = this.componentFactoryResolver.resolveComponentFactory(factoryClass);
    this.componentRef = this.container.createComponent(factory);
    const instance = <DynamicComponent> this.componentRef.instance;
    instance.defaultText = this.defaultText;
    instance.jobId = this.jobId;
    instance.idData = this.idData;
  }

  ngOnDestroy() {
    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = null;
    }
  }

}

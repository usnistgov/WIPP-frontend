import {
  AfterViewInit,
  Component,
  ComponentRef,
  Input,
  OnDestroy,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {UnknownDynamicComponent} from './unknown-dynamic.component';
import {DynamicComponent} from './dynamic.component';
import {ImagesCollectionTemplateComponent} from '../images-collection/images-collection-template/images-collection-template.component';
import {StitchingVectorTemplateComponent} from '../stitching-vector/stitching-vector-template/stitching-vector-template.component';
import {PyramidTemplateComponent} from '../pyramid/pyramid-template/pyramid-template.component';
import {AiModelTemplateComponent} from '../ai-model/ai-model-template/ai-model-template.component';
import {TensorboardLogsTemplateComponent} from '../ai-model/ai-model-template/tensorboard-logs-template.component';
import {CsvCollectionTemplateComponent} from '../csv-collection/csv-collection-template/csv-collection-template.component';
import {NotebookTemplateComponent} from '../notebook/notebook-template/notebook-template.component';
import {GenericDataTemplateComponent} from '../generic-data/generic-data-template/generic-data-template.component';

@Component({
  selector: 'app-dynamic-content',
  template: '<div>\n' +
    '  <div #container></div>\n' +
    '</div>\n',
  styleUrls: ['./dynamic-content.component.css']
})
export class DynamicContentComponent implements OnDestroy, AfterViewInit {
  @ViewChild('container', { read: ViewContainerRef }) container: ViewContainerRef;

  @Input()
  type: string;

  @Input()
  idData: string;

  @Input()
  text: string;

  @Input()
  jobId: string;

  @Input()
  defaultText: string;

  private componentRef: ComponentRef<{}>;

  constructor() {}

  ngAfterViewInit() {

    let dynamicComponent;
    switch(this.type.toLocaleLowerCase()) {
      case "collection":
        dynamicComponent = ImagesCollectionTemplateComponent;
        break;
      case "stitchingvector":
        dynamicComponent = StitchingVectorTemplateComponent;
        break;
      case "pyramid":
        dynamicComponent = PyramidTemplateComponent;
        break;
      case "aimodel":
        dynamicComponent = AiModelTemplateComponent;
        break;
      case "tensorboardlogs":
        dynamicComponent = TensorboardLogsTemplateComponent;
        break;
      case "csvcollection":
        dynamicComponent = CsvCollectionTemplateComponent;
        break;
      case "notebook":
        dynamicComponent = NotebookTemplateComponent;
        break;
      case "genericdata":
        dynamicComponent = GenericDataTemplateComponent;
        break;
      default:
        dynamicComponent = UnknownDynamicComponent;
    }
    this.componentRef = this.container.createComponent(dynamicComponent, {});
    const instance = <DynamicComponent> this.componentRef.instance;
    instance.defaultText = this.defaultText;
    instance.jobId = this.jobId;
    instance.idData = this.idData;
    this.componentRef.changeDetectorRef.detectChanges();
    this.componentRef.onDestroy(()=> {
      this.componentRef.changeDetectorRef.detach();
    })
  }

  ngOnDestroy() {
    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = null;
    }
  }

}

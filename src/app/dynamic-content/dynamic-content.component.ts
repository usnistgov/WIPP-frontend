import {Component, ComponentFactoryResolver, ComponentRef, Input, OnDestroy, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {
  ImagesCollectionFlatTemplateComponent,
  ImagesCollectionTemplateLinkedComponent,
  ImagesCollectionTemplateOutputComponent
} from '../images-collection/images-collection-template/images-collection-template.component';
import {StitchingVectorTemplateComponent} from '../stitching-vector/stitching-vector-template/stitching-vector-template.component';
import {UnknownDynamicComponent} from '../unknown-dynamic/unknown-dynamic.component';

@Component({
  selector: 'app-dynamic-content',
  template: '<div>\n' +
    '  <div #container></div>\n' +
    '</div>\n',
  styleUrls: ['./dynamic-content.component.css']
})
export class DynamicContentComponent implements OnInit, OnDestroy {
  @ViewChild('container', { read: ViewContainerRef })
  container: ViewContainerRef;

  @Input()
  type: string

  @Input()
  context: any;

  private componentRef: ComponentRef<{}>;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  private mappings = {
    'linkedcollection': ImagesCollectionTemplateLinkedComponent,
    'flatcollection': ImagesCollectionFlatTemplateComponent,
    'outputcollection': ImagesCollectionTemplateOutputComponent,
    'sample2': StitchingVectorTemplateComponent,
    // 'imagesColelctionLinked': DynamicSample2Component,
    // 'imagesCollectionsSimple': DynamicSample2Component,
    // 'StitchingVectorLinked': DynamicSample2Component,
    // 'StitchingVectorSimple': DynamicSample2Component,
    // 'PyramidLinked': DynamicSample2Component
    // 'PyramidSimple': DynamicSample2Component
  };
  ngOnInit() {
    if (this.type) {
      const componentType = this.getComponentType(this.type);
      const factory = this.componentFactoryResolver.resolveComponentFactory(
        componentType
      );
      this.componentRef = this.container.createComponent(factory);
    }
  }

  ngOnDestroy() {
    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = null;
    }
  }

  getComponentType(typeName: string) {
    const type = this.mappings[typeName];
    return type || UnknownDynamicComponent;
  }
}

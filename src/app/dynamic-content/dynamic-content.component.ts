import {
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  Input,
  OnDestroy,
  OnInit,
  Type,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {UnknownDynamicComponent} from '../unknown-dynamic/unknown-dynamic.component';
import {DynamicComponent} from './dynamic.component';

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
  idData: string;

  @Input()
  text: string;

  @Input()
  defaultText: string;

  private componentRef: ComponentRef<{}>;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  ngOnInit() {

    const factories = Array.from(this.componentFactoryResolver['_factories'].keys());
    let factoryClass = <Type<any>>factories.find(
      (x: any) => x.key === (this.type.toLocaleLowerCase() + 'templatecomponent'));
    if (!factoryClass || this.idData === 'NAN') {
      factoryClass = UnknownDynamicComponent; }

    const factory = this.componentFactoryResolver.resolveComponentFactory(factoryClass);
    this.componentRef = this.container.createComponent(factory);
    const instance = <DynamicComponent> this.componentRef.instance;
    instance.defaultText = this.defaultText;
    instance.idData = this.idData;
  }

  ngOnDestroy() {
    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = null;
    }
  }

}

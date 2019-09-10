import { Component, OnInit } from '@angular/core';
import {DynamicComponent} from '../../dynamic-content/dynamic.component';

@Component({
  selector: 'app-images-collection-template',
  templateUrl: './images-collection-template.component.html',
  styleUrls: ['./images-collection-template.component.css']
})
export class ImagesCollectionTemplateComponent extends DynamicComponent {
}

@Component({
  selector: 'app-images-collection-linked-template',
  template: 'ImagesCollectionTemplateLinkedComponent  dodo '
})
export class ImagesCollectionTemplateLinkedComponent extends DynamicComponent {
}

@Component({
  selector: 'app-images-collection--flat-template',
  template: 'ImagesCollectionFlatTemplateComponent dodo4 ',
  styleUrls: ['./images-collection-template.component.css']
})
export class ImagesCollectionFlatTemplateComponent extends DynamicComponent {
}

@Component({
  selector: 'app-images-collection--output-template',
  template: 'ImagesCollectionTemplateOutputComponent dododo 99',
  styleUrls: ['./images-collection-template.component.css']
})
export class ImagesCollectionTemplateOutputComponent extends DynamicComponent {
}

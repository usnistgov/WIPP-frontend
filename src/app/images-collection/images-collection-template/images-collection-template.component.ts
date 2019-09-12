import {Component, OnInit} from '@angular/core';
import {DynamicComponent} from '../../dynamic-content/dynamic.component';
import {ImagesCollectionService} from '../images-collection.service';


@Component({
  selector: 'app-images-collection-template',
  template:
    '<a *ngIf="!(idData===\'NAN\')" routerLink="/images-collection/{{idData}}">{{text}}</a>' +
    '<a [hidden]="!(idData===\'NAN\')">{{text}}</a>'
})

export class ImagesCollectionTemplateComponent extends DynamicComponent implements OnInit {

  constructor(
    private imagesCollectionService: ImagesCollectionService) {
    super();
  }
  static key = 'collectiontemplatecomponent';

  ngOnInit() {
    if (this.idData !== 'NAN') {
      this.imagesCollectionService.getImagesCollection(this.idData).subscribe(result => {
        this.text = result.name;
      });
    }
  }
}

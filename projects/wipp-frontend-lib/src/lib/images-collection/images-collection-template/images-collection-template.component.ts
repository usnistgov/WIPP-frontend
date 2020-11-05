import {Component, OnInit} from '@angular/core';
import {DynamicComponent} from '../../dynamic-content/dynamic.component';
import {ImagesCollectionService} from '../images-collection.service';


@Component({
  selector: 'app-images-collection-template',
  template:
    '<a routerLink="/images-collection/{{idData}}">{{text}}</a>'
})

export class ImagesCollectionTemplateComponent extends DynamicComponent implements OnInit {

  constructor(
    private imagesCollectionService: ImagesCollectionService) {
    super();
  }
  static key = 'collectiontemplatecomponent';

  ngOnInit() {
      this.imagesCollectionService.getById(this.idData).subscribe(result => {
        this.text = result.name;
      });
  }
}

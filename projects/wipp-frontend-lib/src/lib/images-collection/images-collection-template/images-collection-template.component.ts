import {Component, OnInit} from '@angular/core';
import {DynamicComponent} from '../../dynamic-content/dynamic.component';
import {ImagesCollectionService} from '../images-collection.service';


@Component({
  selector: 'app-images-collection-template',
  template:
    '<a routerLink="/{{imagesCollectionsUiPath}}/{{idData}}">{{text}}</a>'
})

export class ImagesCollectionTemplateComponent extends DynamicComponent implements OnInit {

  imagesCollectionsUiPath: string;

  constructor(
    private imagesCollectionService: ImagesCollectionService) {
    super();
  }
  static key = 'collectiontemplatecomponent';

  ngOnInit() {
    this.getImagesCollectionsUiPath();
    this.imagesCollectionService.getById(this.idData).subscribe(result => {
      this.text = result.name;
    });
  }

  getImagesCollectionsUiPath() {
    this.imagesCollectionsUiPath = this.imagesCollectionService.getImagesCollectionUiPath(); 
  }
}

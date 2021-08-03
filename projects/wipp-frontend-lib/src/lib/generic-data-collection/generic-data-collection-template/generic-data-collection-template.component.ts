import { Component, OnInit } from '@angular/core';
import {DynamicComponent} from '../../dynamic-content/dynamic.component';
import {GenericDataCollectionService} from '../generic-data-collection.service';

@Component({
  selector: 'app-generic-data-collection-template',
  template:
    '<a routerLink="/{{genericDataCollectionsUiPath}}/{{idData}}">{{text}}</a>',
})
export class GenericDataCollectionTemplateComponent extends DynamicComponent implements OnInit {

  genericDataCollectionsUiPath: string;

  constructor(
    private genericDataCollectionService: GenericDataCollectionService) {
    super();
  }

  static key = 'genericdatacollectiontemplatecomponent';

  ngOnInit() {
    this.getGenericDataCollectionsUiPath();
    if (this.idData) {
      this.genericDataCollectionService.getById(this.idData).subscribe(result => {
        this.text = result.name;
      });
    }
  }

  getGenericDataCollectionsUiPath() {
    this.genericDataCollectionsUiPath = this.genericDataCollectionService.getGenericDataCollectionUiPath();
  }

}

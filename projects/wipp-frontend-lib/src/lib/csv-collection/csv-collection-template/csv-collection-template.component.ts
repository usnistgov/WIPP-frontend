import { Component, OnInit } from '@angular/core';
import {DynamicComponent} from '../../dynamic-content/dynamic.component';
import {CsvCollectionService} from '../csv-collection.service';

@Component({
  selector: 'app-csv-collection-template',
  template:
    '<a routerLink="/{{csvCollectionsUiPath}}/{{idData}}">{{text}}</a>'
  })
export class CsvCollectionTemplateComponent extends DynamicComponent implements OnInit {

  csvCollectionsUiPath: string;

  constructor(private csvCollectionService: CsvCollectionService) {
    super();
  }

  static key = 'csvcollectiontemplatecomponent';

  ngOnInit() {
    this.getCsvCollectionsUiPath();
    if (this.idData) {
      this.csvCollectionService.getById(this.idData).subscribe(result => {
        this.text = result.name;
      });
    }
  }

  getCsvCollectionsUiPath() {
    this.csvCollectionsUiPath = this.csvCollectionService.getCsvCollectionUiPath(); 
  }
}

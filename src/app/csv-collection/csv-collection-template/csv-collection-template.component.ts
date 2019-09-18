import { Component, OnInit } from '@angular/core';
import {DynamicComponent} from '../../dynamic-content/dynamic.component';
import {CsvCollectionService} from '../csv-collection.service';

@Component({
  selector: 'app-csv-collection-template',
  template:
    '<a routerLink="/csv-collections/{{idData}}">{{text}}</a>'
})
export class CsvCollectionTemplateComponent extends DynamicComponent implements OnInit {

  constructor(private csvCollectionService: CsvCollectionService) {
    super();
  }

  static key = 'csvcollectiontemplatecomponent';

  ngOnInit() {
    if (this.idData) {
      this.csvCollectionService.getCsvCollection(this.idData).subscribe(result => {
        this.text = result.name;
      });
    }
  }
}

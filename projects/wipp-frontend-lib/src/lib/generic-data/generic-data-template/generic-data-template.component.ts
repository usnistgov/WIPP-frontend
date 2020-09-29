import { Component, OnInit } from '@angular/core';
import {DynamicComponent} from '../../dynamic-content/dynamic.component';
import {GenericDataService} from '../generic-data.service';

@Component({
  selector: 'app-generic-data-template',
  template:
    '<a routerLink="/generic-datas/{{idData}}">{{text}}</a>',
})
export class GenericDataTemplateComponent extends DynamicComponent implements OnInit {

  constructor(
    private genericDataService: GenericDataService) {
    super();
  }

  static key = 'genericdatatemplatecomponent';

  ngOnInit() {
    if (this.idData) {
      this.genericDataService.getById(this.idData).subscribe(result => {
        this.text = result.name;
      });
    }
  }

}

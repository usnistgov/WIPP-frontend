import { Component, OnInit } from '@angular/core';
import {PyramidAnnotationService} from '../pyramid-annotation.service';
import {DynamicComponent} from '../../dynamic-content/dynamic.component';

@Component({
  selector: 'app-pyramid-annotation-template',
  template:
    '<a routerLink="/pyramid-annotations/{{idData}}">{{text}}</a>'
})
export class PyramidAnnotationTemplateComponent extends DynamicComponent implements OnInit  {

  constructor(
    private pyramidAnnotationService: PyramidAnnotationService) {
    super();
  }

  static key = 'pyramidannotationtemplatecomponent';

  ngOnInit() {
    this.pyramidAnnotationService.getById(this.idData).subscribe(result => {
      this.text = result.name;
    });
  }

}

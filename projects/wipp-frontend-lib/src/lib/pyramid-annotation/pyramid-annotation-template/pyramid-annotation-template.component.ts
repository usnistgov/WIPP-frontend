import { Component, OnInit } from '@angular/core';
import {PyramidAnnotationService} from '../pyramid-annotation.service';
import {DynamicComponent} from '../../dynamic-content/dynamic.component';

@Component({
  selector: 'app-pyramid-annotation-template',
  template:
    '<a routerLink="/{{pyramidAnnotationsUiPath}}/{{idData}}">{{text}}</a>'
})
export class PyramidAnnotationTemplateComponent extends DynamicComponent implements OnInit  {

  pyramidAnnotationsUiPath: string;

  constructor(
    private pyramidAnnotationService: PyramidAnnotationService) {
    super();
  }

  static key = 'pyramidannotationtemplatecomponent';

  ngOnInit() {
    this.getPyramidAnnotationsUiPath();
    this.pyramidAnnotationService.getById(this.idData).subscribe(result => {
      this.text = result.name;
    });
  }

  getPyramidAnnotationsUiPath() {
    this.pyramidAnnotationsUiPath = this.pyramidAnnotationService.getPyramidAnnotationUiPath();
  }

}

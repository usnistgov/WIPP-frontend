import {Component, OnInit} from '@angular/core';
import {DynamicComponent} from '../../dynamic-content/dynamic.component';
import {PyramidService} from '../pyramid.service';

@Component({
  selector: 'app-pyramid-template',
  template:
  ' <a routerLink="/{{pyramidsUiPath}}/{{idData}}">{{text}}</a>'
})
export class PyramidTemplateComponent extends DynamicComponent implements OnInit {

  pyramidsUiPath: string;

  constructor(private pyramidService: PyramidService) {
    super();
  }

  static key = 'pyramidtemplatecomponent';

  ngOnInit() {
    this.getPyramidsUiPath();
    this.pyramidService.getById(this.idData).subscribe(result => {
      this.text = result.name;
    });
  }

  getPyramidsUiPath() {
    this.pyramidsUiPath = this.pyramidService.getPyramidUiPath();
  }
}

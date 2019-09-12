import {Component, OnInit} from '@angular/core';
import {DynamicComponent} from '../../dynamic-content/dynamic.component';
import {PyramidService} from '../pyramid.service';

@Component({
  selector: 'app-pyramid-template',
  template:
  ' <a *ngIf="!(idData===\'NAN\')" routerLink="/pyramids/{{idData}}">{{text}}</a>' +
    '<a [hidden]="!(idData===\'NAN\')">{{text}}</a>'
})
export class PyramidTemplateComponent extends DynamicComponent implements OnInit {

    constructor(
    private pyramidService: PyramidService) {
    super();
}

static key = 'pyramidtemplatecomponent';

  ngOnInit() {
    if (this.idData !== 'NAN') {
      this.pyramidService.getPyramid(this.idData).subscribe(result => {
        this.text = result.name;
      });
    }
  }
}

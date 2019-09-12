import {Component, OnInit} from '@angular/core';
import {DynamicComponent} from '../../dynamic-content/dynamic.component';
import {StitchingVectorService} from '../stitching-vector.service';


@Component({
  selector: 'app-stitching-vector-template',
  template:
    '<a *ngIf="!(idData===\'NAN\')" routerLink="/stitching-vectors/{{idData}}">{{text}}</a>' +
    '<a [hidden]="!(idData===\'NAN\')">{{text}}</a>'
})
export class StitchingVectorTemplateComponent extends DynamicComponent implements OnInit {

    constructor(
    private stitchingVectorService: StitchingVectorService) {
    super();
}

static key = 'stitchingvectortemplatecomponent';

  ngOnInit() {
      if (this.idData !== 'NAN') {
      this.stitchingVectorService.getStitchingVector(this.idData).subscribe(result => {
        this.text = result.name;
      });
    }
  }
}

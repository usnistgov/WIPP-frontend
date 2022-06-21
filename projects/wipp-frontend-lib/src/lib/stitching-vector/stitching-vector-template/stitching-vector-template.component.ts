import {Component, OnInit} from '@angular/core';
import {DynamicComponent} from '../../dynamic-content/dynamic.component';
import {StitchingVectorService} from '../stitching-vector.service';


@Component({
  selector: 'app-stitching-vector-template',
  template:
    '<a routerLink="/{{stitchingVectorsUiPath}}/{{idData}}">{{text}}</a>'
})
export class StitchingVectorTemplateComponent extends DynamicComponent implements OnInit {

  stitchingVectorsUiPath: string;

  constructor(private stitchingVectorService: StitchingVectorService) {
    super();
  }

static key = 'stitchingvectortemplatecomponent';

  ngOnInit() {
    this.getStitchingVectorsUiPath();
      this.stitchingVectorService.getById(this.idData).subscribe(result => {
        this.text = result.name;
      });
    }

  getStitchingVectorsUiPath() {
    this.stitchingVectorsUiPath = this.stitchingVectorService.getStitchingVectorUiPath();
  }
}

import {Component, OnInit} from '@angular/core';
import {DynamicComponent} from '../../dynamic-content/dynamic.component';
import {TensorflowModelService} from '../tensorflow-model.service';


@Component({
  selector: 'app-stitching-vector-template',
  template:
    '<a routerLink="/{{tensorflowModelsUiPath}}/{{idData}}">{{text}}</a>'
})
export class TensorflowModelTemplateComponent extends DynamicComponent implements OnInit {

  tensorflowModelsUiPath: string;

  constructor(private tensorflowModelService: TensorflowModelService) {
    super();
  }

  static key = 'tensorflowmodeltemplatecomponent';

  ngOnInit() {
    if (this.idData) {
      this.tensorflowModelService.getById(this.idData).subscribe(result => {
        this.text = result.name;
      });
    }
  }

  getStitchingVectorsUiPath() {
    this.tensorflowModelsUiPath = this.tensorflowModelService.getTensorflowUiPath();
  }
}

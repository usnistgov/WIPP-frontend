import {Component, OnInit} from '@angular/core';
import {DynamicComponent} from '../../dynamic-content/dynamic.component';
import {TensorflowModelService} from '../tensorflow-model.service';


@Component({
  selector: 'app-stitching-vector-template',
  template:
    '<a routerLink="/tensorflow-models/{{idData}}">{{text}}</a>'
})
export class TensorflowModelTemplateComponent extends DynamicComponent implements OnInit {

    constructor(
    private tensorflowModelService: TensorflowModelService) {
    super();
}

static key = 'tensorflowmodeltemplatecomponent';

  ngOnInit() {
      if (this.idData !== 'NAN') {
      this.tensorflowModelService.getTensorflowModel(this.idData).subscribe(result => {
        this.text = result.name;
      });
    }
  }
}

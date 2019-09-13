import {DynamicComponent} from '../../dynamic-content/dynamic.component';
import {TensorflowModelService} from '../tensorflow-model.service';
import {Component, OnInit} from '@angular/core';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-stitching-vector-template',
  template:
    '<a href="{{tensorboardLink}}" target="_blank"> {{text}} </a>'
})
export class TensorboardLogsTemplateComponent extends DynamicComponent implements OnInit {

    constructor(
    private tensorflowModelService: TensorflowModelService) {
    super();
}
static key = 'tensorboardlogstemplatecomponent';
    tensorboardLink = '';

  ngOnInit() {
      this.tensorflowModelService.getTensorboardLogsByJob(this.jobId).subscribe(result => {
        this.text = result.name;
        this.tensorboardLink = environment.tensorboardUrl + '#scalars&regexInput=' + result.name;
      });
  }
}

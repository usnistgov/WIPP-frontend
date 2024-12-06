import { DynamicComponent } from '../../dynamic-content/dynamic.component';
import { AiModelService } from '../ai-model.service';
import { Component, OnInit } from '@angular/core';
import { AppConfigService } from '../../app-config.service';
import urljoin from 'url-join';

@Component({
  selector: 'app-stitching-vector-template',
  template:
    '<a href="{{tensorboardLink}}" target="_blank"> {{text}} </a>'
})
export class TensorboardLogsTemplateComponent extends DynamicComponent implements OnInit {

  constructor(
    private appConfigService: AppConfigService,
    private AiModelService: AiModelService) {
    super();
  }
  static key = 'tensorboardlogstemplatecomponent';
  tensorboardLink = '';

  ngOnInit() {
    this.AiModelService.getTensorboardLogsByJob(this.jobId).subscribe(result => {
      this.text = result.name;
      this.tensorboardLink = urljoin(this.appConfigService.getConfig().tensorboardUrl,
        '#scalars&regexInput=' + result.name);
    });
  }
}

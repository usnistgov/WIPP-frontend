import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {JobModalService} from './job-modal.service';
import {PluginService} from '../../plugin/plugin.service';
import {Job} from './job';

@Component({
  selector: 'app-job-modal',
  templateUrl: './job-modal.component.html',
  styleUrls: ['./job-modal.component.css']
})
export class JobModalComponent implements OnInit {

  @Input() modalReference: any;

  jobId: string;
  job: Job;
  inputKeys: string[];
  inputType: string;
  outputKeys: string[];
  tempInputName: string;

  constructor(private activeModal: NgbActiveModal,
              private jobModalService: JobModalService,
              private pluginService: PluginService) {
  }

  ngOnInit() {
    this.getJob();
  }

  getJob() {
    this.jobModalService.getJob(this.jobId).subscribe(job => {
        this.job = job;
        this.getPlugin();
        this.job.runningTime = (this.job.endTime && this.job.startTime) ?
          new Date(this.job.endTime.valueOf() - this.job.startTime.valueOf()) : null;
      }
    );
  }

  getPlugin() {
    this.jobModalService.getPlugin(this.job.wippExecutable).subscribe(plugin => {
        this.inputKeys = this.pluginService.getPluginInputKeys(plugin);
        this.outputKeys = this.pluginService.getPluginOutputKeys(plugin);
        this.inputType = this.pluginService.getPluginInputType(plugin, this.inputKeys[0]);
      }
    );
  }

  isOutput(inputName: string): boolean {
    this.parseInputName(inputName);
    return (inputName.search('{') !== -1);
  }

  parseInputName(inputName: string): string {
    // if the input is the output of another job return the first job input name
    if (inputName.search('{') !== -1) {
      inputName = inputName.substr(3, inputName.length - 13);
      this.jobModalService.getJob(inputName).subscribe(name => {
        this.tempInputName = name.name;
      });
    } else {
      this.tempInputName = inputName;
    }
    return inputName;
  }

}

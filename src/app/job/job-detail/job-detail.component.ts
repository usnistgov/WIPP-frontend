import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {PluginService} from '../../plugin/plugin.service';
import {Job} from '../job';
import {JobService} from '../job.service';

  @Component({
  selector: 'app-job-detail',
  templateUrl: './job-detail.component.html',
  styleUrls: ['./job-detail.component.css']
})

export class JobDetailComponent implements OnInit {

  @Input() modalReference: any;

  jobId: string;
  job: Job;
  inputKeys: string[];
  inputType: string;
  outputKeys: string[];
  tempInputName: string;
  inputName: string;

  constructor(private activeModal: NgbActiveModal,
              private jobService: JobService,
              private pluginService: PluginService) {
  }

  ngOnInit() {
    this.getJob();
  }

  getJob() {
    this.jobService.getJob(this.jobId).subscribe(job => {
        this.job = job;
        this.getPlugin();
        this.job.runningTime = (this.job.endTime && this.job.startTime) ?
          new Date(this.job.endTime.valueOf() - this.job.startTime.valueOf()) : null;
      }
    );
  }

  getPlugin() {
    this.jobService.getPlugin(this.job.wippExecutable).subscribe(plugin => {
        this.inputKeys = this.pluginService.getPluginInputKeys(plugin);
        this.outputKeys = this.pluginService.getPluginOutputKeys(plugin);
        this.inputName = this.inputKeys[0];
        this.inputType = this.pluginService.getPluginInputType(plugin, this.inputName);
      }
    );
  }

  isOutput(inputName: string): boolean {
    this.parseInputName(inputName);
    return (inputName.search('{') !== -1);
  }

  parseInputName(inputName: string) {
    // if the input is the output of another job return the first job input name
    if (inputName.search('{') !== -1) {

      const idToOutputDelimiter = inputName.indexOf('.');
      const idFirstLetter = inputName.indexOf(' ') + 1;
      const outputName = inputName.substr(idToOutputDelimiter,  inputName.length - idToOutputDelimiter - idFirstLetter);
      const id  = inputName.substr(idFirstLetter, idToOutputDelimiter - idFirstLetter);
      this.jobService.getJob(id).subscribe(job => {
        this.tempInputName = job.name + outputName ;
      });
    } else {
      this.tempInputName = inputName;
    }
  }

}

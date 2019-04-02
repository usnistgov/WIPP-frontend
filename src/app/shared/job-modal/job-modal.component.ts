import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {JobModalService} from './job-modal.service';
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

  constructor(private activeModal: NgbActiveModal,
              private jobModalService: JobModalService) { }

  ngOnInit() {
    this.getJob();
  }

  getJob() {
    this.jobModalService.getJob(this.jobId).subscribe( job => {
      this.job = job;
      }
    );
  }

}

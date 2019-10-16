import {Component, OnInit} from '@angular/core';
import {Job} from '../../job/job';
import {ActivatedRoute} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {TensorflowModelService} from '../tensorflow-model.service';
import {TensorboardLogs, TensorflowModel} from '../tensorflow-model';
import {JobDetailComponent} from '../../job/job-detail/job-detail.component';
import {AppConfigService} from '../../app-config.service';
import urljoin from 'url-join';

@Component({
  selector: 'app-tensorflow-model-detail',
  templateUrl: './tensorflow-model-detail.component.html',
  styleUrls: ['./tensorflow-model-detail.component.css']
})
export class TensorflowModelDetailComponent implements OnInit {

  tensorflowModel: TensorflowModel = new TensorflowModel();
  tensorboardLogs: TensorboardLogs = null;
  tensorboardLink = '';
  job: Job = null;
  tensorflowModelId = this.route.snapshot.paramMap.get('id');

  constructor(
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private appConfigService: AppConfigService,
    private tensorflowModelService: TensorflowModelService) {
  }

  ngOnInit() {
    this.tensorboardLink = urljoin(this.appConfigService.getConfig().tensorboardUrl, '#scalars&regexInput=');
    this.tensorflowModelService.getTensorflowModel(this.tensorflowModelId)
      .subscribe(tensorflowModel => {
        this.tensorflowModel = tensorflowModel;
        this.getTensorboardLogsAndJob();
      });
  }

  getTensorboardLogsAndJob() {
    if (this.tensorflowModel._links['sourceJob']) {
      this.tensorflowModelService.getJob(this.tensorflowModel._links['sourceJob']['href']).subscribe(job => {
        this.job = job;
        this.tensorflowModelService.getTensorboardLogsByJob(this.job.id).subscribe(res => {
          this.tensorboardLogs = res;
          console.log(this.tensorboardLogs);
          this.tensorboardLink = this.tensorboardLink + this.tensorboardLogs.name;
        });
      });
    }
  }

  displayJobModal(jobId: string) {
    const modalRef = this.modalService.open(JobDetailComponent, {'size': 'lg'});
    modalRef.componentInstance.modalReference = modalRef;
    (modalRef.componentInstance as JobDetailComponent).jobId = jobId;
    modalRef.result.then((result) => {
      }
      , (reason) => {
        console.log('dismissed');
      });
  }
}

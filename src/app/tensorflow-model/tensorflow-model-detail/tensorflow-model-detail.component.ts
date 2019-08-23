import { Component, OnInit } from '@angular/core';
import {Job} from '../../job/job';
import {ActivatedRoute} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {TensorflowModelService} from '../tensorflow-model.service';
import {TensorflowModel} from '../tensorflow-model';
import {JobDetailComponent} from '../../job/job-detail/job-detail.component';

@Component({
  selector: 'app-tensorflow-model-detail',
  templateUrl: './tensorflow-model-detail.component.html',
  styleUrls: ['./tensorflow-model-detail.component.css']
})
export class TensorflowModelDetailComponent implements OnInit {

  tensorflowModel: TensorflowModel = new TensorflowModel();
  job: Job = null;
  tensorflowModelId = this.route.snapshot.paramMap.get('id');

  constructor(
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private tensorflowModelService: TensorflowModelService) {
  }

  ngOnInit() {
    this.tensorflowModelService.getTensorflowModel(this.tensorflowModelId)
      .subscribe(tensorflowModel => {
        this.tensorflowModel = tensorflowModel;
        console.log(this.tensorflowModel);
        this.getJob();
      });
  }

  getJob() {
    if (this.tensorflowModel._links['sourceJob']) {
      this.tensorflowModelService.getJob(this.tensorflowModel._links['sourceJob']['href']).subscribe(job => this.job = job);
    }
  }

  displayJobModal(jobId: string) {
    const modalRef = this.modalService.open(JobDetailComponent);
    modalRef.componentInstance.modalReference = modalRef;
    (modalRef.componentInstance as JobDetailComponent).jobId = jobId;
    modalRef.result.then((result) => {
      }
      , (reason) => {
        console.log('dismissed');
      });
  }
}

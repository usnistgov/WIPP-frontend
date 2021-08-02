import {Component, OnInit} from '@angular/core';
import {Job} from '../../job/job';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {TensorflowModelService} from '../tensorflow-model.service';
import {TensorboardLogs, TensorflowModel} from '../tensorflow-model';
import {JobDetailComponent} from '../../job/job-detail/job-detail.component';
import urljoin from 'url-join';
import {KeycloakService} from '../../services/keycloak/keycloak.service';

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
    private router: Router,
    private modalService: NgbModal,
    private tensorflowModelService: TensorflowModelService,
    private keycloakService: KeycloakService) {
  }

  ngOnInit() {
    this.tensorboardLink = urljoin(this.tensorflowModelService.getTensorboardUrl(), '#scalars&regexInput=');
    this.tensorflowModelService.getById(this.tensorflowModelId)
      .subscribe(tensorflowModel => {
        this.tensorflowModel = tensorflowModel;
        this.getTensorboardLogsAndJob();
      }, error => {
        this.router.navigate(['/404']);
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
  
  makePublicTensorflowModel(): void {
    this.tensorflowModelService.makePublicTensorflowModel(
      this.tensorflowModel).subscribe(tensorflowModel => {
      this.tensorflowModel = tensorflowModel;
    });
  }

  canEdit(): boolean {
    return this.keycloakService.canEdit(this.tensorflowModel);
  }

  openDownload(url: string) {
    this.tensorflowModelService.startDownload(url).subscribe(downloadUrl =>
      window.location.href = downloadUrl['url']);
  }
}

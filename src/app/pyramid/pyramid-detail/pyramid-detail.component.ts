import {Component, OnInit} from '@angular/core';
import {Job} from '../../job/job';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {JobDetailComponent} from '../../job/job-detail/job-detail.component';
import {Pyramid} from '../pyramid';
import {PyramidService} from '../pyramid.service';
import {KeycloakService} from '../../services/keycloak/keycloak.service';

@Component({
  selector: 'app-pyramid-detail',
  templateUrl: './pyramid-detail.component.html',
  styleUrls: ['./pyramid-detail.component.css']
})
export class PyramidDetailComponent implements OnInit {
  pyramid: Pyramid = new Pyramid();
  job: Job = null;
  manifest: any = null;
  pyramidId = this.route.snapshot.paramMap.get('id');

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private pyramidService: PyramidService,
    private keycloakService: KeycloakService) {
  }

  ngOnInit() {
    this.pyramidService.getById(this.pyramidId)
      .subscribe(pyramid => {
        this.pyramid = pyramid;
        this.getJob();
        this.getManifest(pyramid);
      }, error => {
        this.router.navigate(['/404']);
      });
  }

  getJob() {
    if (this.pyramid._links['job']) {
      this.pyramidService.getJob(this.pyramid._links['job']['href']).subscribe(job => this.job = job);
    }
  }

  getManifest(pyramid: Pyramid) {
    this.pyramidService.getPyramidManifest(pyramid).subscribe(manifest => this.manifest = manifest);
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

  makePublicPyramid(): void {
    this.pyramidService.makePublicPyramid(
      this.pyramid).subscribe(pyramid => {
      this.pyramid = pyramid;
    });
  }

  canEdit(): boolean {
    return this.keycloakService.canEdit(this.pyramid);
  }

}

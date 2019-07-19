import {Component, OnInit} from '@angular/core';
import {Job} from '../../job/job';
import {ActivatedRoute} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {JobDetailComponent} from '../../job/job-detail/job-detail.component';
import {Pyramid} from '../pyramid';
import {PyramidService} from '../pyramid.service';

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
    private modalService: NgbModal,
    private pyramidService: PyramidService) {
  }

  ngOnInit() {
    this.pyramidService.getPyramid(this.pyramidId)
      .subscribe(pyramid => {
        this.pyramid = pyramid;
        this.getJob();
        this.getManifest(pyramid);
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

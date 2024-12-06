import { Component, OnInit } from '@angular/core';
import {JobDetailComponent} from '../../job/job-detail/job-detail.component';
import {StitchingVectorService} from '../stitching-vector.service';
import {StitchingVector} from '../stitching-vector';
import {ActivatedRoute, Router} from '@angular/router';
import {Job} from '../../job/job';
import {TimeSlice} from '../timeSlice';
import {KeycloakService} from '../../services/keycloak/keycloak.service';
import {DialogService} from 'primeng/dynamicdialog';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-stitching-vector-detail',
  templateUrl: './stitching-vector-detail.component.html',
  styleUrls: ['./stitching-vector-detail.component.css'],
  providers: [DialogService, MessageService]
})
export class StitchingVectorDetailComponent implements OnInit {

  stitchingVector: StitchingVector = new StitchingVector();
  timeSlices: TimeSlice[] = [];
  resultsLength = 0;
  pageSize = 20;
  job: Job = null;
  stitchingVectorId = this.route.snapshot.paramMap.get('id');

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialogService: DialogService,
    private stitchingVectorService: StitchingVectorService,
    private keycloakService: KeycloakService
    ) {
  }

  ngOnInit() {
    this.stitchingVectorService.getById(this.stitchingVectorId)
      .subscribe(stitchingVector => {
        this.stitchingVector = stitchingVector;
        this.getTimeSlices(null);
        this.getJob();
      }, error => {
        this.router.navigate(['/404']);
      });
  }

  getTimeSlices(event): void {
    const sortField = event?.sortField ? event.sortField : 'fileName,asc';
    const pageIndex = event ? event.first / event.rows : 0;
    const pageSize = event ? event.rows : this.pageSize;
    const params = {
      pageIndex: pageIndex,
      size: pageSize,
      sort: sortField
    };
    this.stitchingVectorService.getTimeSlices(this.stitchingVectorId, params).subscribe(paginatedResult => {
      this.resultsLength = paginatedResult.page.totalElements;
      this.timeSlices = paginatedResult.data;
    });
  }

  getJob() {
    if (this.stitchingVector._links['job']) {
      this.stitchingVectorService.getJob(this.stitchingVector._links['job']['href']).subscribe(job => this.job = job);
    }
  }

  displayJobModal(jobId: string) {
    this.dialogService.open(JobDetailComponent, {
      header: 'Job detail',
      position: 'top',
      width: '50vw',
      data: {
        jobId: jobId
      },
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw'
      }
    });
  }

  makePublicStitchingVector(): void {
    this.stitchingVectorService.makePublicStitchingVector(
      this.stitchingVector).subscribe(imagesCollection => {
      this.stitchingVector = imagesCollection;
    });
  }

  canEdit(): boolean {
    return this.keycloakService.canEdit(this.stitchingVector);
  }

  openStitchingVectorDownload(timeSlice: string) {
    this.stitchingVectorService.startStitchingVectorDownload(this.stitchingVector, timeSlice).subscribe(downloadUrl =>
      window.location.href = downloadUrl['url']);
  }

  openDownload(url: string) {
    this.stitchingVectorService.startDownload(url).subscribe(downloadUrl =>
      window.location.href = downloadUrl['url']);
  }

  ngOnDestroy() {
    this.dialogService.dialogComponentRefMap.forEach((dialog) => dialog.destroy());
  }

}

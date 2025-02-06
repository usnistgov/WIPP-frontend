import { Component } from '@angular/core';
import {Job} from '../../job/job';
import {ActivatedRoute, Router} from '@angular/router';
import {DialogService} from 'primeng/dynamicdialog';
import {KeycloakService} from '../../services/keycloak/keycloak.service';
import {JobDetailComponent} from '../../job/job-detail/job-detail.component';
import {ImageAnnotationsCollection} from '../image-annotations-collection';
import {ImageAnnotation} from '../image-annotation';
import {ImageAnnotationsService} from '../image-annotations.service';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-image-annotations-detail',
  templateUrl: './image-annotations-detail.component.html',
  styleUrl: './image-annotations-detail.component.css',
  providers: [DialogService, MessageService]
})
export class ImageAnnotationsDetailComponent {

  imageAnnotationsCollection: ImageAnnotationsCollection = new ImageAnnotationsCollection();
  annotations: ImageAnnotation[] = [];
  resultsLength = 0;
  pageSize = 20;
  job: Job = null;
  imageAnnotationsCollectionId = this.route.snapshot.paramMap.get('id');

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialogService: DialogService,
    private imageAnnotationsService: ImageAnnotationsService,
    private keycloakService: KeycloakService
  ) {
  }

  ngOnInit() {
    this.imageAnnotationsService.getById(this.imageAnnotationsCollectionId)
      .subscribe(imageAnnotationsCollection => {
        this.imageAnnotationsCollection = imageAnnotationsCollection;
        this.getAnnotations(null);
        this.getJob();
      }, error => {
        this.router.navigate(['/404']);
      });
  }

  getAnnotations(event): void {
    const sortField = event?.sortField ? event.sortField : 'fileName,asc';
    const pageIndex = event ? event.first / event.rows : 0;
    const pageSize = event ? event.rows : this.pageSize;
    const params = {
      pageIndex: pageIndex,
      size: pageSize,
      sort: sortField
    };
    this.imageAnnotationsService.getAnnotations(this.imageAnnotationsCollectionId, params).subscribe(paginatedResult => {
      this.resultsLength = paginatedResult.page.totalElements;
      this.annotations = paginatedResult.data;
    });
  }

  getJob() {
    if (this.imageAnnotationsCollection._links['job']) {
      this.imageAnnotationsService.getJob(this.imageAnnotationsCollection._links['job']['href']).subscribe(job => this.job = job);
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

  ngOnDestroy() {
    this.dialogService.dialogComponentRefMap.forEach((dialog) => dialog.destroy());
  }
}

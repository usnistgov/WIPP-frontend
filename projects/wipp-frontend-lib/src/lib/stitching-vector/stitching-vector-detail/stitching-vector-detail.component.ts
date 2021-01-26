import {Component, OnInit, ViewChild} from '@angular/core';
import {JobDetailComponent} from '../../job/job-detail/job-detail.component';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {StitchingVectorService} from '../stitching-vector.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {StitchingVector} from '../stitching-vector';
import { MatPaginator } from '@angular/material/paginator';
import {ActivatedRoute} from '@angular/router';
import {Job} from '../../job/job';
import {merge, of as observableOf} from 'rxjs';
import {TimeSlice} from '../timeSlice';

@Component({
  selector: 'app-stitching-vector-detail',
  templateUrl: './stitching-vector-detail.component.html',
  styleUrls: ['./stitching-vector-detail.component.css']
})
export class StitchingVectorDetailComponent implements OnInit {

  stitchingVector: StitchingVector = new StitchingVector();
  timeSlices: TimeSlice[] = [];
  displayedColumnsTimeSlices: string[] = ['sliceNumber', 'errorMessage', 'actions'];
  resultsLength = 0;
  pageSize = 20;
  job: Job = null;
  stitchingVectorId = this.route.snapshot.paramMap.get('id');

  @ViewChild('timeSlicesPaginator', {static: true}) timeSlicesPaginator: MatPaginator;
  //@ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  constructor(
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private stitchingVectorService: StitchingVectorService) {
  }

  ngOnInit() {
    this.stitchingVectorService.getById(this.stitchingVectorId)
      .subscribe(stitchingVector => {
        this.stitchingVector = stitchingVector;
        this.getJob();
      });

    console.log('hello');
    console.log(this.timeSlicesPaginator);
    this.getTimeSlices();
  }

  getTimeSlices(): void {
    merge(this.timeSlicesPaginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          const params = {
            pageIndex: this.timeSlicesPaginator.pageIndex,
            size: this.pageSize
          };
          return this.stitchingVectorService.getTimeSlices(this.stitchingVectorId, params);
        }),
        map(paginatedResult => {
          this.resultsLength = paginatedResult.page.totalElements;
          return paginatedResult.data;
        }),
        catchError(() => {
          return observableOf([]);
        })
      ).subscribe(data => this.timeSlices = data);
  }

  getJob() {
    if (this.stitchingVector._links['job']) {
      this.stitchingVectorService.getJob(this.stitchingVector._links['job']['href']).subscribe(job => this.job = job);
    }
  }

  displayJobModal(jobId: string) {
    const modalRef = this.modalService.open(JobDetailComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.modalReference = modalRef;
    (modalRef.componentInstance as JobDetailComponent).jobId = jobId;
    modalRef.result.then((result) => {
      }
      , (reason) => {
        console.log('dismissed');
      });
  }

}

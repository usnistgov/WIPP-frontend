import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material';
import {ActivatedRoute} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {StitchingVector} from '../stitching-vector';
import {TimeSlice} from '../timeSlice';
import {StitchingVectorService} from '../stitching-vector.service';
import {merge, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {Job} from '../job';

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

  @ViewChild('timeSlicesPaginator') timeSlicesPaginator: MatPaginator;

  constructor(
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private stitchingVectorService: StitchingVectorService) {
  }

  ngOnInit() {
    this.stitchingVectorService.getStitchingVector(this.stitchingVectorId)
      .subscribe(stitchingVector => {
        this.stitchingVector = stitchingVector;
      this.getJob(); } );
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
        map(data => {
          this.resultsLength = data.page.totalElements;
          return data.timeSlices;
        }),
        catchError(() => {
          return observableOf([]);
        })
      ).subscribe(data => this.timeSlices = data);
  }

  getJob() {
  this.stitchingVectorService.getJob(this.stitchingVector._links['job']['href']).subscribe(job => this.job = job);
  }

}

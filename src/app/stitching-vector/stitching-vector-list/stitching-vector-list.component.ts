import {Component, NgModule, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatTable, MatTableDataSource, MatTableModule} from '@angular/material';
import {StitchingVector} from '../stitching-vector';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {StitchingVectorNewComponent} from '../stitching-vector-new/stitching-vector-new.component';
import {StitchingVectorService} from '../stitching-vector.service';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {of as observableOf} from 'rxjs';

@Component({
  selector: 'app-stitching-vector-list',
  templateUrl: './stitching-vector-list.component.html',
  styleUrls: ['./stitching-vector-list.component.css']
})
@NgModule({
  imports: [MatTableModule, MatTableDataSource, MatTable]
})
export class StitchingVectorListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'creationDate', 'numberOfTimeSlices'];
  stitchingVectors: StitchingVector[] = [];

  resultsLength = 0;
  pageSize = 20;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  // @ViewChild(MatSort) sort: MatSort;

  constructor(
    private stitchingVectorService: StitchingVectorService,
    private modalService: NgbModal
  ) {
  }

  ngOnInit() {
    this.getStitchingVectors();
  }

  getStitchingVectors(): void {
    this.paginator.page.pipe(
      startWith({}),
      switchMap(() => {
        const params = {
          pageIndex: this.paginator.pageIndex,
          size: this.pageSize
        };
        return this.stitchingVectorService.getStitchingVectors(params);
      }),
      map(data => {
        this.resultsLength = data.page.totalElements;
        return data.stitchingVectors;
      }),
      catchError(() => {
        return observableOf([]);
      })
    ).subscribe(data => this.stitchingVectors = data);
  }

  createNew() {
    const modalRef = this.modalService.open(StitchingVectorNewComponent, {size: 'lg'});
    modalRef.componentInstance.modalReference = modalRef;
    modalRef.result.then((result) => {
        this.getStitchingVectors();
      },
      (reason) => {
        console.log('dismissed');
      });
  }

}

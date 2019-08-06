import {Component, NgModule, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTable, MatTableDataSource, MatTableModule} from '@angular/material';
import {StitchingVector} from '../stitching-vector';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {StitchingVectorNewComponent} from '../stitching-vector-new/stitching-vector-new.component';
import {StitchingVectorService} from '../stitching-vector.service';
import {catchError, map, switchMap} from 'rxjs/operators';
import {BehaviorSubject, Observable, of as observableOf} from 'rxjs';

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
  stitchingVectors: Observable<StitchingVector[]>;

  resultsLength = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [10, 25, 50, 100];
  paramsChange: BehaviorSubject<{index: number, size: number, sort: string, filter: string}>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    private stitchingVectorService: StitchingVectorService,
    private modalService: NgbModal
  ) {
    this.paramsChange = new BehaviorSubject({
      index: 0,
      size: this.pageSize,
      sort: 'creationDate,desc',
      filter: ''
    });
  }

  sortChanged(sort) {
    // If the user changes the sort order, reset back to the first page.
    this.paramsChange.next({
      index: 0, size: this.paramsChange.value.size,
      sort: sort.active + ',' + sort.direction, filter: this.paramsChange.value.filter
    });
  }

  pageChanged(page) {
    this.paramsChange.next({
      index: page.pageIndex, size: page.pageSize,
      sort: this.paramsChange.value.sort, filter: this.paramsChange.value.filter
    });
  }

  applyFilterByName(filterValue: string) {
    // if the user filters by name, reset back to the first page
    this.paramsChange.next({
      index: 0, size: this.paramsChange.value.size, sort: this.paramsChange.value.sort, filter: filterValue
    });
  }

  ngOnInit() {
    this.getStitchingVectors();
  }

  getStitchingVectors(): void {
    const paramsObservable = this.paramsChange.asObservable();
    this.stitchingVectors = paramsObservable.pipe(
      switchMap((page) => {
        const params = {
          pageIndex: page.index,
          size: page.size,
          sort: page.sort
        };
        if (page.filter) {
          return this.stitchingVectorService.getStitchingVectorsByNameContainingIgnoreCase(params, page.filter).pipe(
            map((data) => {
              this.resultsLength = data.page.totalElements;
              return data.stitchingVectors;
            }),
            catchError(() => {
              return observableOf([]);
            })
          );
        }
        return this.stitchingVectorService.getStitchingVectors(params).pipe(
          map((data) => {
            this.resultsLength = data.page.totalElements;
            return data.stitchingVectors;
          }),
          catchError(() => {
            return observableOf([]);
          })
        );
      })
    );
  }

  createNew() {
    const modalRef = this.modalService.open(StitchingVectorNewComponent, {size: 'lg'});
    modalRef.result.then((result) => {
      if (result) {
        this.getStitchingVectors();
      }
    },
      (reason) => {
        console.log('dismissed');
      });
  }

}

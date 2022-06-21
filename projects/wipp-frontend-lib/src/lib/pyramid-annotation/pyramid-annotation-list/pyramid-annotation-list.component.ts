import {Component, NgModule, OnInit, ViewChild} from '@angular/core';
import {PyramidAnnotation} from '../pyramid-annotation';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import {PyramidAnnotationService} from '../pyramid-annotation.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {catchError, map, switchMap} from 'rxjs/operators';
import {BehaviorSubject, Observable, of as observableOf} from 'rxjs';

@Component({
  selector: 'app-pyramid-annotation-list',
  templateUrl: './pyramid-annotation-list.component.html',
  styleUrls: ['./pyramid-annotation-list.component.css']
})
export class PyramidAnnotationListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'creationDate', 'numberOfTimeSlices', 'owner', 'publiclyShared'];  
  pyramidAnnotations: Observable<PyramidAnnotation[]>;
  pyramidAnnotationsUiPath: string;

  resultsLength = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [10, 25, 50, 100];
  paramsChange: BehaviorSubject<{index: number, size: number, sort: string, filter: string}>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    private pyramidAnnotationService: PyramidAnnotationService,
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
    this.getPyramidAnnotations();
    this.getPyramidAnnotationUiPath();
  }

  getPyramidAnnotations(): void {
    const paramsObservable = this.paramsChange.asObservable();
    this.pyramidAnnotations = paramsObservable.pipe(
      switchMap((page) => {
        const params = {
          pageIndex: page.index,
          size: page.size,
          sort: page.sort
        };
        if (page.filter) {
          return this.pyramidAnnotationService.getByNameContainingIgnoreCase(params, page.filter).pipe(
            map((paginatedResult) => {
              this.resultsLength = paginatedResult.page.totalElements;
              return paginatedResult.data;
            }),
            catchError(() => {
              return observableOf([]);
            })
          );
        }
        return this.pyramidAnnotationService.get(params).pipe(
          map((paginatedResult) => {
            this.resultsLength = paginatedResult.page.totalElements;
            return paginatedResult.data;
          }),
          catchError(() => {
            return observableOf([]);
          })
        );
      })
    );
  }

  getPyramidAnnotationUiPath() {
    this.pyramidAnnotationsUiPath = this.pyramidAnnotationService.getPyramidAnnotationUiPath();
  }
}


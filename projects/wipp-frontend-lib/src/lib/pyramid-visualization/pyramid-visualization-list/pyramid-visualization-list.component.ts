import {Component, OnInit, ViewChild} from '@angular/core';
import {BehaviorSubject, Observable, of as observableOf} from 'rxjs';
import {Visualization} from '../visualization';
import {MatPaginator, MatSort} from '@angular/material';
import {Router} from '@angular/router';
import {PyramidVisualizationService} from '../pyramid-visualization.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {catchError, map, switchMap} from 'rxjs/operators';
import {PyramidVisualizationNewComponent} from '../pyramid-visualization-new/pyramid-visualization-new.component';

@Component({
  selector: 'app-pyramid-visualization-list',
  templateUrl: './pyramid-visualization-list.component.html',
  styleUrls: ['./pyramid-visualization-list.component.css']
})
export class PyramidVisualizationListComponent implements OnInit {

  displayedColumns: string[] = ['name', 'creationDate'];
  visualizations: Observable<Visualization[]>;

  resultsLength = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [10, 25, 50, 100];
  paramsChange: BehaviorSubject<{index: number, size: number, sort: string, filter: string}>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private visualizationService: PyramidVisualizationService
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
    const paramsObservable = this.paramsChange.asObservable();
    this.visualizations = paramsObservable.pipe(
      switchMap((page) => {
        const params = {
          pageIndex: page.index,
          size: page.size,
          sort: page.sort
        };
        if (page.filter) {
          return this.visualizationService.getVisualizationsByNameContainingIgnoreCase(params, page.filter).pipe(
            map((paginatedResult) => {
              this.resultsLength = paginatedResult.page.totalElements;
              return paginatedResult.data;
            }),
            catchError(() => {
              return observableOf([]);
            })
          );
        }
        return this.visualizationService.getVisualizations(params).pipe(
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

  createNew() {
    const modalRef = this.modalService.open(PyramidVisualizationNewComponent);
    modalRef.componentInstance.modalReference = modalRef;
    modalRef.result.then((result) => {
      this.visualizationService.createVisualization(result).subscribe(visualization => {
        const visualizationId = visualization ? visualization.id : null;
        this.router.navigate(['pyramid-visualizations', visualizationId]);
      });
    }, (reason) => {
      console.log('dismissed');
    });
  }


}

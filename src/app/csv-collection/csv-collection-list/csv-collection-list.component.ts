import {Component, OnInit, ViewChild} from '@angular/core';
import {BehaviorSubject, Observable, of as observableOf} from 'rxjs';
import {MatPaginator, MatSort} from '@angular/material';
import {catchError, map, switchMap} from 'rxjs/operators';
import {CsvCollection} from '../csv-collection';
import {CsvCollectionService} from '../csv-collection.service';

@Component({
  selector: 'app-csv-collection-list',
  templateUrl: './csv-collection-list.component.html',
  styleUrls: ['./csv-collection-list.component.css']
})
export class CsvCollectionListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'creationDate'];
  csvCollections: Observable<CsvCollection[]>;

  resultsLength = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [10, 25, 50, 100];
  paramsChange: BehaviorSubject<{index: number, size: number, sort: string, filter: string}>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private csvCollectionService: CsvCollectionService) {
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
    this.getCsvCollections();
  }

  getCsvCollections(): void {
    const paramsObservable = this.paramsChange.asObservable();
    this.csvCollections = paramsObservable.pipe(
      switchMap((page) => {
        const params = {
          pageIndex: page.index,
          size: page.size,
          sort: page.sort
        };
        if (page.filter) {
          return this.csvCollectionService.getCsvCollectionsByNameContainingIgnoreCase(params, page.filter).pipe(
            map((data) => {
              this.resultsLength = data.page.totalElements;
              return data.csvCollections;
            }),
            catchError(() => {
              return observableOf([]);
            })
          );
        }
        return this.csvCollectionService.getCsvCollections(params).pipe(
          map((data) => {
            this.resultsLength = data.page.totalElements;
            return data.csvCollections;
          }),
          catchError(() => {
            return observableOf([]);
          })
        );
      })
    );
  }

}

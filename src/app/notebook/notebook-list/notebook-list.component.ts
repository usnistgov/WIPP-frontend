import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BehaviorSubject, Observable, of as observableOf} from 'rxjs';
import {MatPaginator, MatSort} from '@angular/material';
import {catchError, map, switchMap} from 'rxjs/operators';
import {Notebook} from '../notebook';
import {NotebookService} from '../notebook.service';
import {HttpClient} from '@angular/common/http';


@Component({
  selector: 'app-notebook-list',
  templateUrl: './notebook-list.component.html',
  styleUrls: ['./notebook-list.component.css']
})
export class NotebookListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'creationDate'];
  notebooks: Observable<Notebook[]>;

  resultsLength = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [10, 25, 50, 100];
  paramsChange: BehaviorSubject<{ index: number, size: number, sort: string, filter: string }>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  // @ViewChild('target') target: ElementRef;


  constructor(
    private notebookService: NotebookService,
    private http: HttpClient) {
    this.paramsChange = new BehaviorSubject({
      index: 0,
      size: this.pageSize,
      sort: 'creationDate,desc',
      filter: ''
    });
  }

    ngOnInit() {
    const paramsObservable = this.paramsChange.asObservable();
    this.notebooks = paramsObservable.pipe(
      switchMap((page) => {
        const params = {
          pageIndex: page.index,
          size: page.size,
          sort: page.sort
        };
        if (page.filter) {
          return this.notebookService.getNotebooksByNameContainingIgnoreCase(params, page.filter).pipe(
            map((data) => {
              this.resultsLength = data.page.totalElements;
              return data.notebooks;
            }),
            catchError(() => {
              return observableOf([]);
            })
          );
        }
        return this.notebookService.getNotebooks(params).pipe(
          map((data) => {
            this.resultsLength = data.page.totalElements;
            return data.notebooks;
          }),
          catchError(() => {
            return observableOf([]);
          })
        );
      })
    );
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





}

import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort} from '@angular/material';
import {BehaviorSubject, Observable, of as observableOf} from 'rxjs';
import {TensorflowModel} from '../tensorflow-model';
import {TensorflowModelService} from '../tensorflow-model.service';
import {catchError, map, switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-tensorflow-model-list',
  templateUrl: './tensorflow-model-list.component.html',
  styleUrls: ['./tensorflow-model-list.component.css']
})
export class TensorflowModelListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'creationDate'];
  tensorflowModels: Observable<TensorflowModel[]>;

  resultsLength = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [10, 25, 50, 100];
  paramsChange: BehaviorSubject<{index: number, size: number, sort: string, filter: string}>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private tensorflowModelService: TensorflowModelService) {
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
    console.log('Tensrflow model component!!!');
    console.log(this.tensorflowModels);
    this.getTensorflowModels();
  }

  getTensorflowModels(): void {
    const paramsObservable = this.paramsChange.asObservable();
    this.tensorflowModels = paramsObservable.pipe(
      switchMap((page) => {
        const params = {
          pageIndex: page.index,
          size: page.size,
          sort: page.sort
        };
        if (page.filter) {
          return this.tensorflowModelService.getByNameContainingIgnoreCase(params, page.filter).pipe(
            map((data) => {
              this.resultsLength = data.page.totalElements;
              return data.tensorflowModels;
            }),
            catchError(() => {
              return observableOf([]);
            })
          );
        }
        return this.tensorflowModelService.get(params).pipe(
          map((data) => {
            this.resultsLength = data.page.totalElements;
            return data.tensorflowModels;
          }),
          catchError(() => {
            return observableOf([]);
          })
        );
      })
    );
  }

}


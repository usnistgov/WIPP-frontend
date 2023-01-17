import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BehaviorSubject, Observable, of as observableOf} from 'rxjs';
import {MatPaginator, MatSort} from '@angular/material';
import {catchError, map, switchMap} from 'rxjs/operators';
import {GenericDataService} from '../generic-data.service';
import { GenericData } from '../generic-data';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GenericDataNewComponent } from '../generic-data-new/generic-data-new.component';
import {Router} from '@angular/router';
import {KeycloakService} from '../../services/keycloak/keycloak.service';

@Component({
  selector: 'app-generic-data-list',
  templateUrl: './generic-data-list.component.html',
  styleUrls: ['./generic-data-list.component.css']
})
export class GenericDataListComponent implements OnInit , OnDestroy{
  displayedColumns: string[] = ['name', 'creationDate', 'owner', 'publiclyShared'];
  genericDatas: Observable<GenericData[]>;

  resultsLength = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [10, 25, 50, 100];
  paramsChange: BehaviorSubject<{index: number, size: number, sort: string, filter: string}>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private genericDataService: GenericDataService,
    private modalService: NgbModal,
    private keycloakService: KeycloakService) {
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
    this.getGenericDatas();
  }

  getGenericDatas(): void {
    const paramsObservable = this.paramsChange.asObservable();
    this.genericDatas = paramsObservable.pipe(
      switchMap((page) => {
        const params = {
          pageIndex: page.index,
          size: page.size,
          sort: page.sort
        };
        if (page.filter) {
          return this.genericDataService.getByNameContainingIgnoreCase(params, page.filter).pipe(
            map((paginatedResult) => {
              this.resultsLength = paginatedResult.page.totalElements;
              return paginatedResult.data;
            }),
            catchError(() => {
              return observableOf([]);
            })
          );
        }
        return this.genericDataService.get(params).pipe(
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
    const modalRef = this.modalService.open(GenericDataNewComponent, {size: 'lg'});
    modalRef.componentInstance.modalReference = modalRef;
  }

  canCreate() : boolean {
    return(this.keycloakService.isLoggedIn());
  }

  ngOnDestroy() {
    this.modalService.dismissAll();
  }

}

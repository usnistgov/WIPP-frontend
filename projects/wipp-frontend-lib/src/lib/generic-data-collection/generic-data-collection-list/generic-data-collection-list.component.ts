import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BehaviorSubject, Observable, of as observableOf} from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {catchError, map, switchMap} from 'rxjs/operators';
import {GenericDataCollectionService} from '../generic-data-collection.service';
import {GenericDataCollection} from '../generic-data-collection';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {GenericDataCollectionNewComponent} from '../generic-data-collection-new/generic-data-collection-new.component';
import { KeycloakService } from '../../services/keycloak/keycloak.service';

@Component({
  selector: 'app-generic-data-collection-list',
  templateUrl: './generic-data-collection-list.component.html',
  styleUrls: ['./generic-data-collection-list.component.css'],
})
export class GenericDataCollectionListComponent implements OnInit , OnDestroy{
  displayedColumns: string[] = ['name', 'creationDate', 'owner', 'publiclyShared'];
  genericDataCollections: Observable<GenericDataCollection[]>;
  genericDataCollectionsUiPath: string;

  resultsLength = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [10, 25, 50, 100];
  paramsChange: BehaviorSubject<{index: number, size: number, sort: string, filter: string}>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private genericDataCollectionService: GenericDataCollectionService,
    private keycloakService: KeycloakService,
    private modalService: NgbModal) {
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
    this.getGenericDataCollectionsUiPath();
    this.getGenericDataCollections();
  }

  getGenericDataCollections(): void {
    const paramsObservable = this.paramsChange.asObservable();
    this.genericDataCollections = paramsObservable.pipe(
      switchMap((page) => {
        const params = {
          pageIndex: page.index,
          size: page.size,
          sort: page.sort
        };
        if (page.filter) {
          return this.genericDataCollectionService.getByNameContainingIgnoreCase(params, page.filter).pipe(
            map((paginatedResult) => {
              this.resultsLength = paginatedResult.page.totalElements;
              return paginatedResult.data;
            }),
            catchError(() => {
              return observableOf([]);
            })
          );
        }
        return this.genericDataCollectionService.get(params).pipe(
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

  getGenericDataCollectionsUiPath() {
    this.genericDataCollectionsUiPath = this.genericDataCollectionService.getGenericDataCollectionUiPath();
  }
  
  createNew() {
    const modalRef = this.modalService.open(GenericDataCollectionNewComponent, {size: 'lg'});
    modalRef.componentInstance.modalReference = modalRef;
  }

  ngOnDestroy() {
    this.modalService.dismissAll();
  }

  canCreate(): boolean {
    return(this.keycloakService.isLoggedIn());
  }

}

import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BehaviorSubject, Observable, of as observableOf} from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {catchError, map, switchMap} from 'rxjs/operators';
import {CsvCollection} from '../csv-collection';
import {CsvCollectionService} from '../csv-collection.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CsvCollectionNewComponent} from '../csv-collection-new/csv-collection-new.component';
import { KeycloakService } from '../../services/keycloak/keycloak.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-csv-collection-list',
  templateUrl: './csv-collection-list.component.html',
  styleUrls: ['./csv-collection-list.component.css']
})
export class CsvCollectionListComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['name', 'creationDate', 'owner', 'publiclyShared'];
  csvCollections: Observable<CsvCollection[]>;
  csvCollectionsUiPath: string;

  resultsLength = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [10, 25, 50, 100];
  paramsChange: BehaviorSubject<{index: number, size: number, sort: string, filter: string}>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private csvCollectionService: CsvCollectionService,
    private router: Router,
    private keycloakService: KeycloakService,
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
    this.getCsvCollectionsUiPath();
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
          return this.csvCollectionService.getByNameContainingIgnoreCase(params, page.filter).pipe(
            map((paginatedResult) => {
              this.resultsLength = paginatedResult.page.totalElements;
              return paginatedResult.data;
            }),
            catchError(() => {
              return observableOf([]);
            })
          );
        }
        return this.csvCollectionService.get(params).pipe(
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
    const modalRef = this.modalService.open(CsvCollectionNewComponent, {size: 'lg'});
    modalRef.componentInstance.modalReference = modalRef;
  }

  ngOnDestroy() {
    this.modalService.dismissAll();
  }

  getCsvCollectionsUiPath() {
    this.csvCollectionsUiPath = this.csvCollectionService.getCsvCollectionUiPath();
  }

  canCreate(): boolean {
    return(this.keycloakService.isLoggedIn());
  }
}

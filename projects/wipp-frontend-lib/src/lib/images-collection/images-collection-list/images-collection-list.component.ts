import { Component, NgModule, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ImagesCollectionService } from '../images-collection.service';
import { ImagesCollection } from '../images-collection';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatTable } from '@angular/material/table';
import { BehaviorSubject, combineLatest, Observable, of as observableOf } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImagesCollectionNewComponent } from '../images-collection-new/images-collection-new.component';
import { Router } from '@angular/router';
import { ModalErrorComponent } from '../../modal-error/modal-error.component';
import { KeycloakService } from '../../services/keycloak/keycloak.service';

@Component({
  selector: 'app-images-collection-list',
  templateUrl: './images-collection-list.component.html',
  styleUrls: ['./images-collection-list.component.css']
})
export class ImagesCollectionListComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['name', 'numberOfImages', 'locked', 'publiclyShared', 'creationDate', 'imagesTotalSize', 'owner'];
  imagesCollections: Observable<ImagesCollection[]>;
  imagesCollectionsUiPath: string;

  resultsLength = 0;
  pageSize = 10;
  isLoadingResults = true;
  pageSizeOptions: number[] = [10, 25, 50, 100];
  paramsChange: BehaviorSubject<{ index: number, size: number, sort: string, filterName: string, filterNbOfImgs: string }>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    private imagesCollectionService: ImagesCollectionService,
    private modalService: NgbModal,
    private router: Router,
    private keycloakService: KeycloakService
  ) {
    this.paramsChange = new BehaviorSubject({
      index: 0,
      size: this.pageSize,
      sort: 'creationDate,desc',
      filterName: '',
      filterNbOfImgs: ''
    });
  }

  sortChanged(sort) {
    // If the user changes the sort order, reset back to the first page.
    this.paramsChange.next({
      index: 0,
      size: this.paramsChange.value.size,
      sort: sort.active + ',' + sort.direction,
      filterName: this.paramsChange.value.filterName,
      filterNbOfImgs: this.paramsChange.value.filterNbOfImgs
    });
  }

  pageChanged(page) {
    this.paramsChange.next({
      index: page.pageIndex,
      size: page.pageSize,
      sort: this.paramsChange.value.sort,
      filterName: this.paramsChange.value.filterName,
      filterNbOfImgs: this.paramsChange.value.filterNbOfImgs
    });
  }

  applyFilterByName(filterValue: string) {
    // if the user filters by name, reset back to the first page
    this.paramsChange.next({
      index: 0,
      size: this.paramsChange.value.size,
      sort: this.paramsChange.value.sort,
      filterName: filterValue,
      filterNbOfImgs: ''
    });
  }

  applyFilterByNbOfImages(filterValue: string) {
    // if the user filters by the number of images, reset back to the first page
    this.paramsChange.next({
      index: 0,
      size: this.paramsChange.value.size,
      sort: this.paramsChange.value.sort,
      filterName: '',
      filterNbOfImgs: filterValue
    });
  }

  ngOnInit() {
    this.getImagesCollectionsUiPath();
    const paramsObservable = this.paramsChange.asObservable();
    this.imagesCollections = paramsObservable.pipe(
      switchMap((page) => {
        this.isLoadingResults = true;
        const params = {
          pageIndex: page.index,
          size: page.size,
          sort: page.sort
        };
        if (page.filterName) {
          return this.imagesCollectionService.getByNameContainingIgnoreCase(params, page.filterName).pipe(
            map((paginatedResult) => {
              this.isLoadingResults = false;
              this.resultsLength = paginatedResult.page.totalElements;
              return paginatedResult.data;
            }),
            catchError(() => {
              this.isLoadingResults = false;
              return observableOf([]);
            })
          );
        }
        if (page.filterNbOfImgs) {
          return this.imagesCollectionService
            .getImagesCollectionsByNameContainingIgnoreCaseAndNumberOfImages(params, '', page.filterNbOfImgs)
            .pipe(
              map((paginatedResult) => {
                this.isLoadingResults = false;
                this.resultsLength = paginatedResult.page.totalElements;
                return paginatedResult.data;
              }),
              catchError(() => {
                this.isLoadingResults = false;
                return observableOf([]);
              })
            );
        }
        return this.imagesCollectionService.get(params).pipe(
          map((paginatedResult) => {
            this.isLoadingResults = false;
            this.resultsLength = paginatedResult.page.totalElements;
            return paginatedResult.data;
          }),
          catchError(() => {
            this.isLoadingResults = false;
            return observableOf([]);
          })
        );
      })
    );
  }

  createNew() {
    const modalRef = this.modalService.open(ImagesCollectionNewComponent, { size: 'lg' });
    modalRef.componentInstance.modalReference = modalRef;
    modalRef.result.then((result) => {
      this.imagesCollectionService.createImagesCollection(result).subscribe(imagesCollection => {
        const imageCollId = imagesCollection ? imagesCollection.id : null;
        this.router.navigate([this.imagesCollectionService.getImagesCollectionUiPath(), imageCollId]);
      }, error => {
        const modalRefErr = this.modalService.open(ModalErrorComponent);
        modalRefErr.componentInstance.title = 'Error while creating new Images Collection';
        modalRefErr.componentInstance.message = error.error;
      });
    }, (reason) => {
      console.log('dismissed');
    });
  }

  ngOnDestroy() {
    this.modalService.dismissAll();
  }

  getImagesCollectionsUiPath() {
    this.imagesCollectionsUiPath = this.imagesCollectionService.getImagesCollectionUiPath();
  }

  canCreate(): boolean {
    return (this.keycloakService.isLoggedIn());
  }
}

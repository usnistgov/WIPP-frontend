import {Component, NgModule, OnInit, ViewChild} from '@angular/core';
import {ImagesCollectionService} from '../images-collection.service';
import {ImagesCollection} from '../images-collection';
import {MatTableModule, MatTableDataSource, MatPaginator, MatSort} from '@angular/material';
import {MatTable} from '@angular/material';
import {BehaviorSubject, combineLatest, Observable, of as observableOf} from 'rxjs';
import {catchError, map, switchMap} from 'rxjs/operators';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ImagesCollectionNewComponent} from '../images-collection-new/images-collection-new.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-images-collection-list',
  templateUrl: './images-collection-list.component.html',
  styleUrls: ['./images-collection-list.component.css']
})
@NgModule({
  imports: [MatTableModule, MatTableDataSource, MatTable]
})
export class ImagesCollectionListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'numberOfImages', 'locked', 'creationDate', 'imagesTotalSize'];
  imagesCollections: Observable<ImagesCollection[]>;
  resultsLength = 0;
  pageSize = 10;
  isLoadingResults = true;
  pageSizeOptions: number[] = [10, 25, 50, 100];
  paramsChange: BehaviorSubject<{index: number, size: number, sort: string}>;
  filterNameChange: BehaviorSubject<string>;
  filterNbOfImagesChange: BehaviorSubject<string>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    private imagesCollectionService: ImagesCollectionService,
    private modalService: NgbModal,
    private router: Router
  ) {
    this.paramsChange = new BehaviorSubject({
      index: 0,
      size: this.pageSize,
      sort: 'creationDate,desc'
    });
    this.filterNameChange = new BehaviorSubject('');
    this.filterNbOfImagesChange = new BehaviorSubject('');
  }

  sortChanged(sort) {
    // If the user changes the sort order, reset back to the first page.
    this.paramsChange.next({index: 0, size: this.paramsChange.value.size, sort: sort.active + ',' + sort.direction});
  }

  pageChanged(page) {
    this.paramsChange.next({index: page.pageIndex, size: page.pageSize, sort: this.paramsChange.value.sort});
  }

  applyFilterByName(filterValue: string) {
    this.filterNameChange.next(filterValue);
  }

  applyFilterByNbOfImages(filterValue: string) {
    this.filterNbOfImagesChange.next(filterValue);
  }

  ngOnInit() {
    const paramsObservable = this.paramsChange.asObservable();
    const filterNameObservable = this.filterNameChange.asObservable();
    const filterNbOfImagesObservable = this.filterNbOfImagesChange.asObservable();
    this.imagesCollections = combineLatest(paramsObservable, filterNameObservable, filterNbOfImagesObservable).pipe(
      switchMap(([page, filterByName, filterByNbOfImages]) => {
        this.isLoadingResults = true;
        const params = {
          pageIndex: page.index,
          size: page.size,
          sort: page.sort
        };
        if (filterByName) {
          return this.imagesCollectionService.getImagesCollectionsByNameContainingIgnoreCase(params, filterByName).pipe(
            map((data) => {
              this.isLoadingResults = false;
              this.resultsLength = data.page.totalElements;
              return data.imagesCollections;
            }),
            catchError(() => {
              this.isLoadingResults = false;
              return observableOf([]);
            })
          );
        }
        if (filterByNbOfImages) {
          return this.imagesCollectionService
            .getImagesCollectionsByNameContainingIgnoreCaseAndNumberOfImages(params, '', filterByNbOfImages)
            .pipe(
              map((data) => {
                this.isLoadingResults = false;
                this.resultsLength = data.page.totalElements;
                return data.imagesCollections;
              }),
              catchError(() => {
                this.isLoadingResults = false;
                return observableOf([]);
              })
            );
        }
        return this.imagesCollectionService.getImagesCollections(params).pipe(
          map((data) => {
            this.isLoadingResults = false;
            this.resultsLength = data.page.totalElements;
            return data.imagesCollections;
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
    const modalRef = this.modalService.open(ImagesCollectionNewComponent, {size: 'lg'});
    modalRef.componentInstance.modalReference = modalRef;
    modalRef.result.then((result) => {
      this.imagesCollectionService.createImagesCollection(result).subscribe(imagesCollection => {
        const imageCollId = imagesCollection ? imagesCollection.id : null;
        this.router.navigate(['images-collection', imageCollId]);
      });
    }, (reason) => {
      console.log('dismissed');
    });
  }
}

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
  pageChange: BehaviorSubject<{ index: number, size: number}>;
  sortChange: BehaviorSubject<string>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    private imagesCollectionService: ImagesCollectionService,
    private modalService: NgbModal,
    private router: Router
  ) {
    this.pageChange = new BehaviorSubject({
      index: 0,
      size: this.pageSize,
    });
    this.sortChange = new BehaviorSubject('');
  }

  sortChanged(sort) {
    this.sortChange.next(sort.active + ',' + sort.direction);
  }

  pageChanged(page) {
    this.pageChange.next({index: page.pageIndex, size: page.pageSize});
  }

  ngOnInit() {
    const sortObservable = this.sortChange.asObservable();
    const pageObservable = this.pageChange.asObservable();
    this.imagesCollections = combineLatest(sortObservable, pageObservable).pipe(
      switchMap(([sort, page]) => {
        this.isLoadingResults = true;
        const params = {
          pageIndex: page.index,
          size: page.size,
          sort: sort
        };
        return this.imagesCollectionService.getImagesCollections(params).pipe(
          map((data) => {
            this.isLoadingResults = false;
            this.resultsLength = data.page.totalElements;
            console.log(data);
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
    const modalRef = this.modalService.open(ImagesCollectionNewComponent, { size: 'lg' });
    modalRef.componentInstance.modalReference = modalRef;
    modalRef.result.then((result) => {
      this.imagesCollectionService.createImagesCollection(result).subscribe(imagesCollection => {
        const imageCollId = imagesCollection ? imagesCollection.id : null;
        this.router.navigate(['images-collection', imageCollId ]);
      });
    }, (reason) => {
      console.log('dismissed');
    });
  }
}

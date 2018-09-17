import {Component, NgModule, OnInit, ViewChild} from '@angular/core';
import {ImagesCollectionService} from '../images-collection.service';
import {ImagesCollection} from '../images-collection';
import {MatTableModule, MatTableDataSource, MatPaginator, MatSort} from '@angular/material';
import {MatTable} from '@angular/material';
import {merge, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
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
  imagesCollections: ImagesCollection[] = [];

  resultsLength = 0;
  pageSize = 20;
  isLoadingResults = true;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private imagesCollectionService: ImagesCollectionService,
    private modalService: NgbModal,
    private router: Router
  ) { }

  ngOnInit() {
   // this.getImagesCollections();
    console.log(this.paginator);
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          const params = {
            pageIndex: this.paginator.pageIndex,
            size: this.pageSize
          };
          return this.imagesCollectionService.getImagesCollections(params);
        }),
        map(data => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.resultsLength = data.page.totalElements;
          console.log(data);
          return data.imagesCollections;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          return observableOf([]);
        })
      ).subscribe(data => this.imagesCollections = data);
  }

  createNew() {
    const modalRef = this.modalService.open(ImagesCollectionNewComponent);
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

  // getImagesCollections(): void {
  //   this.imagesCollectionService.getImagesCollections()
  //     .subscribe(result => this.dataSource = result);
  // }

}



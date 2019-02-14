import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, NgModule } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import {catchError, map, startWith, switchMap, throttleTime} from 'rxjs/operators';
import * as Flow from '@flowjs/flow.js';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {BytesPipe, NgMathPipesModule} from 'angular-pipes';
import {ImagesCollectionService} from '../images-collection.service';
import {ImagesCollection} from '../images-collection';
import {Image} from '../image';
import {MatPaginator} from '@angular/material';
import {merge, of as observableOf, Subject} from 'rxjs';
import {MetadataFile} from '../metadata-file';
import {InlineEditorModule} from '@qontu/ngx-inline-editor';

@Component({
  selector: 'app-images-collection-detail',
  templateUrl: './images-collection-detail.component.html',
  styleUrls: ['./images-collection-detail.component.css']
})

@NgModule({
  imports: [ NgbModule, NgMathPipesModule, BytesPipe, InlineEditorModule ]
})
export class ImagesCollectionDetailComponent implements OnInit, AfterViewInit {

  flowHolder: Flow.IFlow;
  imagesCollection: ImagesCollection = new ImagesCollection();
  images: Image[] = [];
  metadataFiles: MetadataFile[] = [];

  displayedColumnsImages: string[] = ['index', 'name', 'size', 'actions'];
  displayedColumnsMetadata: string[] = ['index', 'name', 'size', 'actions'];

  uploadOption = 'regular';
  resultsLength = 0;
  pageSize = 20;
  imageCollectionId = this.route.snapshot.paramMap.get('id');

  @ViewChild('browseBtn') browseBtn: ElementRef;
  @ViewChild('browseDirBtn') browseDirBtn: ElementRef;
  @ViewChild('dropArea') dropArea: ElementRef;
  @ViewChild('imagesPaginator') imagesPaginator: MatPaginator;
  // @ViewChild('imagesSort') sort: MatSort;
  @ViewChild('metadataFilesPaginator') metadataFilesPaginator: MatPaginator;

  // @ViewChild('metadataFilesSort') metadataFilesSort: MatSort;

  $throttleRefresh: Subject<void> = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private elem: ElementRef,
    private imagesCollectionService: ImagesCollectionService) { }

  ngOnInit() {

    this.flowHolder = new Flow({
      uploadMethod: 'POST',
      method: 'octet'
    });
    this.$throttleRefresh.pipe(
      throttleTime(1000),
      switchMap(() => this.refresh()))
    .subscribe();
  }

  ngAfterViewInit() {
    // fixme: temporary fix while waiting for 1.0.0 release of ngx-inline-editor
    const faRemoveElt = this.elem.nativeElement.querySelector('.fa-remove');
    faRemoveElt.classList.remove('fa-remove');
    faRemoveElt.classList.add('fa-times');

    this.refresh().subscribe(imagesCollection => {
      if (!imagesCollection.locked) {
        this.initFlow();
      }
    });
    // If the user changes the sort order, reset back to the first page.
    // this.sort.sortChange.subscribe(() => this.imagesPaginator.pageIndex = 0);
  }

  refresh() {
    return this.getImagesCollection().pipe(
      map(imagesCollection => {
      this.imagesCollection = imagesCollection;
      this.getImages();
      this.getMetadataFiles();
      if (this.imagesCollection.numberImportingImages !== 0) {
        this.$throttleRefresh.next();
      }
      return imagesCollection;
    }));
  }

  getImagesCollection() {
    return this.imagesCollectionService.getImagesCollection(this.imageCollectionId);
  }

  getImages(): void {
    merge(this.imagesPaginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          const params = {
            pageIndex: this.imagesPaginator.pageIndex,
            size: this.pageSize
          };
          return this.imagesCollectionService.getImages(this.imagesCollection, params);
        }),
        map(data => {
          this.resultsLength = data.page.totalElements;
          return data.images;
        }),
        catchError(() => {
          return observableOf([]);
        })
      ).subscribe(data => this.images = data);
  }

  getMetadataFiles(): void {
    merge(this.metadataFilesPaginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          const params = {
            pageIndex: this.metadataFilesPaginator.pageIndex,
            size: this.pageSize
          };
          return this.imagesCollectionService.getMetadataFiles(this.imagesCollection, params);
        }),
        map(data => {
          this.resultsLength = data.page.totalElements;
          return data.metadataFiles;
        }),
        catchError(() => {
          return observableOf([]);
        })
      ).subscribe(data => this.metadataFiles = data);
  }

  getNbFiles(): number {
    const imagesCollection = this.imagesCollection;
    if (!imagesCollection) {
      return 0;
    }
    return imagesCollection.numberOfImages +
      imagesCollection.numberOfMetadataFiles;
  }

  updateCollectionName(name: string): void {
    this.imagesCollectionService.setImagesCollectionName(
      this.imagesCollection, name).subscribe(imagesCollection => {
      this.imagesCollection = imagesCollection;
    });
  }

  lockCollection(): void {
    this.imagesCollectionService.lockImagesCollection(
      this.imagesCollection).subscribe(imagesCollection => {
      this.imagesCollection = imagesCollection;
    });
  }

  deleteCollection(): void {
    if (confirm('Are you sure you want to delete the collection ' + this.imagesCollection.name + '?')) {
      this.imagesCollectionService.deleteImagesCollection(this.imagesCollection).subscribe(collection => {
        this.router.navigate(['images-collections']);
      });
    }
  }

  deleteImage(image: Image): void {
    this.imagesCollectionService.deleteImage(image).subscribe(result => {
       this.$throttleRefresh.next();
    });
  }

  deleteMetadataFile(metadataFile: MetadataFile): void {
    this.imagesCollectionService.deleteMetadataFile(metadataFile).subscribe(result => {
      this.$throttleRefresh.next();
    });
  }

  deleteAllImages(): void {
    this.imagesCollectionService.deleteAllImages(this.imagesCollection).subscribe(result => {
      this.$throttleRefresh.next();
    });
  }

  deleteAllMetadataFiles(): void {
    this.imagesCollectionService.deleteAllMetadataFiles(this.imagesCollection).subscribe(result => {
      this.$throttleRefresh.next();
    });
  }

  getPattern(): string {
    const imagesCollection = this.imagesCollection;
    if (!imagesCollection.pattern) {
      return 'Null';
    }
    return imagesCollection.pattern;
  }

  initFlow(): void {

    this.flowHolder.assignBrowse([this.browseBtn.nativeElement], false, false);
    this.flowHolder.assignBrowse([this.browseDirBtn.nativeElement], true, false);
    this.flowHolder.assignDrop(this.dropArea.nativeElement);

    const id = this.route.snapshot.paramMap.get('id');
    const imagesUploadUrl = this.imagesCollectionService.getImagesUrl(this.imagesCollection);
    const metadataFilesUploadUrl = this.imagesCollectionService.getMetadataFilesUrl(this.imagesCollection);

    this.flowHolder.opts.target = function(file) {
      const imagesExtensions = ['tif', 'tiff', 'jpg', 'jpeg', 'png'];
      const isImage = imagesExtensions.indexOf(
        file.getExtension()) >= 0;
      return isImage ? imagesUploadUrl : metadataFilesUploadUrl;
    };

    const self = this;
    this.flowHolder.on('fileAdded', function(file, event) {
      console.log('Added');
      console.log(file, event);

      const nbElementsPath = (file.relativePath.match(/\//g) || []).length + 1;

      console.log('file.name: ' + file.name);
      if (file.name === '.DS_Store' || file.name === 'thumbs.db') {
        return false;
      }

      switch (self.uploadOption) {
        case 'regular': {
          console.log('Upload option selected : regular');
          break;
        }
        case 'includeSubsInPath': {
          console.log('Upload option selected : includeSubsInPath');
          file.name = file.relativePath.replace(/\//g, '_');
          break;
        }
        case 'ignoreSubs': {
          console.log('Upload option selected : ignoreSubs');
          if (nbElementsPath > 2) {
            console.log('must be ignored');
            return false;
          }
          break;
        }
        default: {
          console.log('default upload option is regular');
          break;
        }
      }

    });
    this.flowHolder.on('fileSuccess', function(file, message) {
      this.removeFile(file);
       self.$throttleRefresh.next();
    });
    this.flowHolder.on('fileError', function(file, message) {
      console.log('Error');
      console.log(file, message);
      file.errorMessage = message;
    });
    this.flowHolder.on('filesSubmitted', function(files, event) {
      this.upload();
    });
  }

  hasFilesNotComplete(files) {
    return files.some(this.transferNotCompleteFilter);
  }

  transferNotCompleteFilter(flowFile) {
    return !flowFile.isComplete() || flowFile.error;
  }

}

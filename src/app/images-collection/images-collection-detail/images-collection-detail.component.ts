import {AfterViewInit, Component, ElementRef, NgModule, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {auditTime, catchError, map, startWith, switchMap} from 'rxjs/operators';
import * as Flow from '@flowjs/flow.js';
import {NgbModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {BytesPipe, NgMathPipesModule} from 'angular-pipes';
import {ImagesCollectionService} from '../images-collection.service';
import {ImagesCollection} from '../images-collection';
import {Image} from '../image';
import {MatAutocomplete, MatAutocompleteSelectedEvent, MatPaginator, MatSort, MatChipInputEvent, MatChipInput} from '@angular/material';
import {BehaviorSubject, Observable, of as observableOf, Subject} from 'rxjs';
import {MetadataFile} from '../metadata-file';
import {InlineEditorModule} from '@qontu/ngx-inline-editor';
import {JobDetailComponent} from '../../job/job-detail/job-detail.component';
import {Job} from '../../job/job';
import {FormControl} from '@angular/forms';
import {COMMA, ENTER, SPACE} from '@angular/cdk/keycodes';
import {MatChipsModule} from '@angular/material/chips';
import {Tag} from '../tag';

@Component({
  selector: 'app-images-collection-detail',
  templateUrl: './images-collection-detail.component.html',
  styleUrls: ['./images-collection-detail.component.css']
})

@NgModule({
  imports: [NgbModule, NgMathPipesModule, BytesPipe, InlineEditorModule]
})
export class ImagesCollectionDetailComponent implements OnInit, AfterViewInit {

  flowHolder: Flow.IFlow;
  imagesCollection: ImagesCollection = new ImagesCollection();
  images: Observable<Image[]>;
  metadataFiles: Observable<MetadataFile[]>;
  tags: Observable<Tag[]>;
  fruits: Observable <Tag[]>;
  sourceJob: Job = null;

  displayedColumnsImages: string[] = ['index', 'fileName', 'size', 'actions'];
  displayedColumnsMetadata: string[] = ['index', 'name', 'size', 'actions'];

  pageSizeOptions: number[] = [10, 25, 50, 100];
  imagesParamsChange: BehaviorSubject<{ index: number, size: number, sort: string }>;
  metadataParamsChange: BehaviorSubject<{ index: number, size: number, sort: string }>;
  tagsParamsChange: BehaviorSubject<{ index: number, size: number, sort: string }>;

  uploadOption = 'regular';
  resultsLengthImages = 0;
  resultsLengthMetadataFiles = 0;
  resultsLengthTags = 0;
  pageSizeImages = 10;
  pageSizeMetadataFiles = 10;
  goToPageImages;
  goToPageMetadataFiles;
  imageCollectionId = this.route.snapshot.paramMap.get('id');
  visible = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA, SPACE];
  fruitCtrl = new FormControl();
  filteredFruits: Observable<string[]>;
  allFruits: Tag[];

  @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  @ViewChild('browseBtn') browseBtn: ElementRef;
  @ViewChild('browseDirBtn') browseDirBtn: ElementRef;
  @ViewChild('dropArea') dropArea: ElementRef;
  @ViewChild('imagesPaginator') imagesPaginator: MatPaginator;
  @ViewChild('imagesSort') sort: MatSort;
  @ViewChild('metadataFilesPaginator') metadataFilesPaginator: MatPaginator;
  @ViewChild('metadataFilesSort') metadataFilesSort: MatSort;

  $throttleRefresh: Subject<void> = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private elem: ElementRef,
    private modalService: NgbModal,
    private imagesCollectionService: ImagesCollectionService) {
    this.imagesParamsChange = new BehaviorSubject({
      index: 0,
      size: this.pageSizeImages,
      sort: ''
    });
    this.metadataParamsChange = new BehaviorSubject({
      index: 0,
      size: this.pageSizeMetadataFiles,
      sort: ''
    });
    this.tagsParamsChange = new BehaviorSubject({
      index: 0,
      size: this.pageSizeMetadataFiles,
      sort: ''
    });
  }

  imagesSortChanged(sort) {
    // If the user changes the sort order, reset back to the first page.
    this.imagesParamsChange.next({index: 0, size: this.imagesParamsChange.value.size, sort: sort.active + ',' + sort.direction});
  }

  imagesPageChanged(page) {
    this.imagesParamsChange.next({index: page.pageIndex, size: page.pageSize, sort: this.imagesParamsChange.value.sort});
    this.pageSizeImages = page.pageSize;
  }

  goToPageImage() {
    if (this.imagesPaginator.pageIndex !== this.goToPageImages - 1) {
      this.imagesPaginator.pageIndex = this.goToPageImages - 1;
      this.imagesParamsChange.next({index: this.goToPageImages - 1, size: this.pageSizeImages, sort: this.imagesParamsChange.value.sort});
      this.goToPageImages = '';
    }
  }

  metadataSortChanged(sort) {
    // If the user changes the sort order, reset back to the first page.
    this.metadataParamsChange.next({index: 0, size: this.metadataParamsChange.value.size, sort: sort.active + ',' + sort.direction});
  }

  metadataPageChanged(page) {
    this.metadataParamsChange.next({index: page.pageIndex, size: page.pageSize, sort: this.metadataParamsChange.value.sort});
    this.pageSizeMetadataFiles = page.pageSize;
  }

  goToPageMetadata() {
    if (this.metadataFilesPaginator.pageIndex !== this.goToPageMetadataFiles - 1) {
      this.metadataFilesPaginator.pageIndex = this.goToPageMetadataFiles - 1;
      this.metadataParamsChange.next({
        index: this.goToPageMetadataFiles - 1,
        size: this.pageSizeMetadataFiles,
        sort: this.metadataParamsChange.value.sort
      });
      this.goToPageMetadataFiles = '';
    }
  }

  ngOnInit() {
    this.flowHolder = new Flow({
      uploadMethod: 'POST',
      method: 'octet'
    });
    this.$throttleRefresh.pipe(
      auditTime(1000),
      switchMap(() => this.refresh()))
      .subscribe();
  }

  ngAfterViewInit() {
    // fixme: temporary fix while waiting for 1.0.0 release of ngx-inline-editor
    const faRemoveElt = this.elem.nativeElement.querySelector('.fa-remove');
    faRemoveElt.classList.remove('fa-remove');
    faRemoveElt.classList.add('fa-times');

    this.refresh().subscribe(imagesCollection => {
      console.log(imagesCollection);
      // this.fruits = this.imagesCollectionService.getTags(imagesCollection, null);
      //
      // this.allFruits = this.imagesCollectionService.getAllTags(imagesCollection, null);
      console.log('allFruits');
      console.log(this.allFruits);
      // this.allFruits = ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry'];
      // this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
      //   startWith(null),
      //   map((fruit: any | null) => fruit ? this._filter(fruit) : imagesCollection.tags.slice()));


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
        this.getTags();

        if (this.imagesCollection.numberImportingImages !== 0) {
          this.$throttleRefresh.next();
        }
        this.getSourceJob();

        return imagesCollection;
      }));
  }

  getImagesCollection() {
    return this.imagesCollectionService.getImagesCollection(this.imageCollectionId);
  }

  getImages(): void {
    const paramsObservable = this.imagesParamsChange.asObservable();
    this.images = paramsObservable.pipe(
      switchMap((page) => {
        const params = {
          pageIndex: page.index,
          size: page.size,
          sort: page.sort
        };
        return this.imagesCollectionService.getImages(this.imagesCollection, params).pipe(
          map((data) => {
            this.resultsLengthImages = data.page.totalElements;
            return data.images;
          }),
          catchError(() => {
            return observableOf([]);
          })
        );
      })
    );
  }

  getMetadataFiles(): void {
    const metadataParamsObservable = this.metadataParamsChange.asObservable();
    this.metadataFiles = metadataParamsObservable.pipe(
      switchMap((page) => {
        console.log(page);
        const metadataParams = {
          pageIndex: page.index,
          size: page.size,
          sort: page.sort
        };
        return this.imagesCollectionService.getMetadataFiles(this.imagesCollection, metadataParams).pipe(
          map((data) => {
            this.resultsLengthMetadataFiles = data.page.totalElements;
            return data.metadataFiles;
          }),
          catchError(() => {
            return observableOf([]);
          })
        );
      })
    );
  }

  getTags(): void {
    const tagsParamsObservable = this.tagsParamsChange.asObservable();
    this.tags = tagsParamsObservable.pipe(
      switchMap((page) => {
        console.log(page);
        const tagsParams = {
          pageIndex: page.index,
          size: page.size,
          sort: page.sort
        };
        return this.imagesCollectionService.getTags(this.imagesCollection).pipe(
          map((data) => {
            this.resultsLengthTags = data.page.totalElements;
            return data.tags;
          }),
          catchError(() => {
            return observableOf([]);
          })
        );
      })
    );
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

  deleteAllTags(): void {
    this.imagesCollectionService.deleteAllTags(this.imagesCollection).subscribe(result => {
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
    const tagsUploadUrl = this.imagesCollectionService.getTagsUrl(this.imagesCollection);

    this.flowHolder.opts.target = function (file) {
      const imagesExtensions = ['tif', 'tiff', 'jpg', 'jpeg', 'png'];
      const isImage = imagesExtensions.indexOf(
        file.getExtension()) >= 0;
      return isImage ? imagesUploadUrl : metadataFilesUploadUrl;
    };

    const self = this;
    this.flowHolder.on('fileAdded', function (file, event) {
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
    this.flowHolder.on('fileSuccess', function (file, message) {
      this.removeFile(file);
      self.$throttleRefresh.next();
    });
    this.flowHolder.on('fileError', function (file, message) {
      console.log('Error');
      console.log(file, message);
      file.errorMessage = message;
    });
    this.flowHolder.on('filesSubmitted', function (files, event) {
      this.upload();
    });
  }

  hasFilesNotComplete(files) {
    return files.some(this.transferNotCompleteFilter);
  }

  transferNotCompleteFilter(flowFile) {
    return !flowFile.isComplete() || flowFile.error;
  }

  displayJobModal(jobId: string) {
    const modalRef = this.modalService.open(JobDetailComponent, {size: 'lg', backdrop: 'static'});
    modalRef.componentInstance.modalReference = modalRef;
    (modalRef.componentInstance as JobDetailComponent).jobId = jobId;
    modalRef.result.then((result) => {
      }
      , (reason) => {
        console.log('dismissed');
      });
  }

  getSourceJob() {
    this.imagesCollectionService.getSourceJob(this.imagesCollection).subscribe(job => {
      this.sourceJob = job;
    });
  }

  add(event: MatChipInputEvent): void {
    // TODO post objet to db and tagList
    // console.log(event);
    // Add fruit only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    console.log('event');
    console.log(event);
    if (!this.matAutocomplete.isOpen) {
       console.log('ADD');
      const input = event.input;
      const value = event.value;

      // Add our fruit
      if ((value || '').trim()) {
        const tag = new Tag();
        tag.tagName = value.trim();
        console.log(tag.tagName);
        this.imagesCollectionService.addTag(tag, this.imagesCollection);
        // this.fruits.push({'id': 13, 'name': value.trim()});
        // this.allFruits.push({'id': 13, 'name': value.trim()});
       }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.fruitCtrl.setValue(null);
    }
  }

  addTag(tagName: String) {
    // if tag is already in Tag List
      // add tag to this imageCollection

    // else
      // create new Tag
      // add tag to this imageCollection
  }

  remove(fruit: string): void {
    // const index = this.fruits.indexOf(fruit);

    // if (index >= 0) {
    //   this.fruits.splice(index, 1);
    //   this.imagesCollectionService.deleteTag(null);
    // }

  }

  selected(event: MatAutocompleteSelectedEvent): void {
    console.log('SELECTED');
    console.log(event);

    // console.log('event.option.viewValue');
    // console.log(event.option.viewValue);
    // this.fruits.push(event.option.value);
    this.fruitInput.nativeElement.value = '';
    this.fruitCtrl.setValue(null);
  }

  private _filter(value: string): string[] {

    // console.log('filter_________');
    // console.log(value);
    try {
      const filterValue = value['name'].toLowerCase();
      // console.log('filterValue')
      // console.log(filterValue);
      // console.log( 'this.allFruitsSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS');
      // console.log( this.fruits);

      // console.log('this.allFruits.filter(fruit => fruit[name].toLowerCase().indexOf(filterValue) === 0)');
      // console.log( this.allFruits.filter(fruit => fruit['name'].toLowerCase().indexOf(filterValue) === 0));

      // return this.allFruits.filter(fruit => fruit['name'].toLowerCase().indexOf(filterValue) === 0);
    } catch (e) {
      return [''];

    }
  }

}

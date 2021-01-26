import {AfterViewInit, Component, ElementRef, NgModule, OnInit, ViewChild} from '@angular/core';
import {Job} from '../../job/job';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {JobDetailComponent} from '../../job/job-detail/job-detail.component';
import {CsvCollectionService} from '../csv-collection.service';
import {CsvCollection} from '../csv-collection';
import urljoin from 'url-join';
import {BehaviorSubject, Observable, of as observableOf, Subject} from 'rxjs';
import * as Flow from '@flowjs/flow.js';
import {auditTime, catchError, map, switchMap} from 'rxjs/operators';
import {BytesPipe, NgMathPipesModule} from 'angular-pipes';
import { MatPaginator } from '@angular/material/paginator';
import {Csv} from '../csv';

@Component({
  selector: 'app-csv-collection-detail',
  templateUrl: './csv-collection-detail.component.html',
  styleUrls: ['./csv-collection-detail.component.css']
})

export class CsvCollectionDetailComponent implements OnInit, AfterViewInit {

  csvCollection: CsvCollection = new CsvCollection();
  job: Job = null;
  csvCollectionId = this.route.snapshot.paramMap.get('id');
  plotsUiLink = '';
  uploadOption = 'regular';
  csv: Observable<Csv[]>;
  resultsLengthCsv = 0;
  pageSize = 5;

  pageSizeOptions: number[] = [10, 25, 50, 100];
  csvParamsChange: BehaviorSubject<{ index: number, size: number, sort: string }>;

  $throttleRefresh: Subject<void> = new Subject<void>();
  flowHolder: Flow.IFlow;
  displayedColumnsCsv: string[] = ['index', 'fileName', 'fileSize', 'actions'];

  //@ViewChild('browseBtn') browseBtn: ElementRef;
  // @ViewChild('browseBtn', {static: false}) browseBtn !: ElementRef;
  @ViewChild('browseBtn') browseBtn: ElementRef;
  @ViewChild('csvPaginator') csvPaginator: MatPaginator;

  constructor(
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private router: Router,
    private csvCollectionService: CsvCollectionService) {
    this.csvParamsChange = new BehaviorSubject({
      index: 0,
      size: this.pageSize,
      sort: ''});
  }

  ngOnInit() {
    this.plotsUiLink = urljoin(this.csvCollectionService.getPlotsUiUrl(), 'plots', this.csvCollectionId);
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
    this.refresh().subscribe(csvCollection => {
      if (!csvCollection.locked) {
        this.initFlow();
      }
    });
  }

  refresh() {
    return this.getCsvCollection().pipe(
      map(csvCollection => {
        this.csvCollection = csvCollection;
        this.getCsvFiles();
        if (this.csvCollection.numberImportingCsv !== 0) {
          this.$throttleRefresh.next();
        }
        this.getJob();
        return csvCollection;
      }));
  }

  csvSortChanged(sort) {
    // If the user changes the sort order, reset back to the first page.
    this.csvParamsChange.next({index: 0, size: this.csvParamsChange.value.size, sort: sort.active + ',' + sort.direction});
  }

  csvPageChanged(page) {
    this.csvParamsChange.next({index: page.pageIndex, size: page.pageSize, sort: this.csvParamsChange.value.sort});
    this.pageSize = page.pageSize;
  }

  getCsvCollection() {
    return this.csvCollectionService.getById(this.csvCollectionId);
  }

  hasFilesNotComplete(files) {
    return files.some(this.transferNotCompleteFilter);
  }

  transferNotCompleteFilter(flowFile) {
    return !flowFile.isComplete() || flowFile.error;
  }

  getJob() {
    if (this.csvCollection._links['sourceJob']) {
      this.csvCollectionService.getJob(this.csvCollection._links['sourceJob']['href']).subscribe(job => this.job = job);
    }
  }

  displayJobModal(jobId: string) {
    const modalRef = this.modalService.open(JobDetailComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.modalReference = modalRef;
    (modalRef.componentInstance as JobDetailComponent).jobId = jobId;
    modalRef.result.then((result) => {
      }
      , (reason) => {
        console.log('dismissed');
      });
  }

  initFlow(): void {
    this.flowHolder.assignBrowse([this.browseBtn.nativeElement], false, false, {'accept': '.csv'});

    const id = '';
    const csvUploadUrl = this.csvCollectionService.getCsvUrl(this.csvCollection);
    this.flowHolder.opts.target = csvUploadUrl;

    const self = this;
    this.flowHolder.on('fileAdded', function (file, event) {
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
      console.log(file, message);
      file.errorMessage = message;
    });
    this.flowHolder.on('filesSubmitted', function (files, event) {
      this.upload();
    });
  }

  getCsvFiles(): void {
    const paramsObservable = this.csvParamsChange.asObservable();
    this.csv = paramsObservable.pipe(
      switchMap((page) => {
        const params = {
          pageIndex: page.index,
          size: page.size,
          sort: page.sort
        };
        return this.csvCollectionService.getCsvFiles(this.csvCollection, params).pipe(
          map((paginatedResult) => {
            this.resultsLengthCsv = paginatedResult.page.totalElements;
            return paginatedResult.data;
          }),
          catchError(() => {
            return observableOf([]);
          })
        );
      })
    );
  }

  lockCollection(): void {
    this.csvCollectionService.lockCsvCollection(
      this.csvCollection).subscribe(csvCollection => {
      this.csvCollection = csvCollection;
    });
  }

  deleteCollection(): void {
    if (confirm('Are you sure you want to delete the collection ' + this.csvCollection.name + '?')) {
      this.csvCollectionService.deleteCsvCollection(this.csvCollection).subscribe(collection => {
        this.router.navigate(['csv-collections']);
      });
    }
  }

  deleteCsvFile(csv: Csv): void {
    this.csvCollectionService.deleteCsvFile(csv).subscribe(result => {
      this.$throttleRefresh.next();
    });
  }

  deleteAllCsvFiles(): void {
    this.csvCollectionService.deleteAllCsvFiles(this.csvCollection).subscribe(result => {
      this.$throttleRefresh.next();
    });
  }

}

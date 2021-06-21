import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {Job} from '../../job/job';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {JobDetailComponent} from '../../job/job-detail/job-detail.component';
import {GenericData} from '../generic-data';
import {GenericFile} from '../generic-file';
import {GenericDataService} from '../generic-data.service';
import {BehaviorSubject, Observable, of as observableOf, Subject} from 'rxjs';
import * as Flow from '@flowjs/flow.js';
import {auditTime, catchError, map, switchMap} from 'rxjs/operators';
import {BytesPipe} from 'angular-pipes';
import {MatPaginator} from '@angular/material/paginator';
import { ModalErrorComponent } from '../../modal-error/modal-error.component';
import { KeycloakService } from '../../services/keycloak/keycloak.service';

@Component({
  selector: 'app-generic-data-detail',
  templateUrl: './generic-data-detail.component.html',
  styleUrls: ['./generic-data-detail.component.css']
})
export class GenericDataDetailComponent implements OnInit, AfterViewInit {

  genericData: GenericData = new GenericData();
  job: Job = null;
  genericDataId = this.route.snapshot.paramMap.get('id');
  uploadOption = 'regular';
  genericFiles: Observable<GenericFile[]>;
  resultsLengthGenericFiles = 0;
  pageSize = 5;

  pageSizeOptions: number[] = [10, 25, 50, 100];
  genericFilesParamsChange: BehaviorSubject<{ index: number, size: number, sort: string }>;

  $throttleRefresh: Subject<void> = new Subject<void>();
  flowHolder: Flow.IFlow;
  displayedColumnsGenericFiles: string[] = ['index', 'fileName', 'fileSize', 'actions'];

  @ViewChild('browseBtn') browseBtn: ElementRef;
  @ViewChild('browseDirBtn') browseDirBtn: ElementRef;
  @ViewChild('dropArea') dropArea: ElementRef;
  @ViewChild('genericFilesPaginator') genericFilesPaginator: MatPaginator;

  constructor(
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private router: Router,
    private genericDataService: GenericDataService,
    private keycloakService: KeycloakService ) {
      this.genericFilesParamsChange = new BehaviorSubject({
        index: 0,
        size: this.pageSize,
        sort: ''});
  }

  ngOnInit() {
    this.flowHolder = new Flow({
      uploadMethod: 'POST',
      method: 'octet',
      headers: {Authorization: `Bearer ${this.keycloakService.getKeycloakAuth().token}`}
    });
    this.$throttleRefresh.pipe(
      auditTime(1000),
      switchMap(() => this.refresh()))
      .subscribe();
  }

  ngAfterViewInit() {
    this.refresh().subscribe(genericData => {
      if (this.canEdit() && !genericData.locked) {
        this.initFlow();
      }
    }, error => {
      this.router.navigate(['/404']);
    });
  }

  refresh() {
    return this.getGenericData().pipe(
      map(genericData => {
        this.genericData = genericData;
        this.getGenericFiles();
        if (this.genericData.numberImportingGenericFiles !== 0) {
          this.$throttleRefresh.next();
        }
        this.getJob();
        return genericData;
      }));
  }

  genericFilesSortChanged(sort) {
    // If the user changes the sort order, reset back to the first page.
    this.genericFilesParamsChange.next({index: 0, size: this.genericFilesParamsChange.value.size, sort: sort.active + ',' + sort.direction});
  }

  genericFilesPageChanged(page) {
    this.genericFilesParamsChange.next({index: page.pageIndex, size: page.pageSize, sort: this.genericFilesParamsChange.value.sort});
    this.pageSize = page.pageSize;
  }

  getGenericData() {
    return this.genericDataService.getById(this.genericDataId);
  }

  hasFilesNotComplete(files) {
    return files.some(this.transferNotCompleteFilter);
  }

  transferNotCompleteFilter(flowFile) {
    return !flowFile.isComplete() || flowFile.error;
  }

  getJob() {
    if (this.genericData._links['sourceJob']) {
      this.genericDataService.getJob(this.genericData._links['sourceJob']['href']).subscribe(job => this.job = job);
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
    this.flowHolder.assignBrowse([this.browseBtn.nativeElement], false, false, {'accept': ''});
    this.flowHolder.assignBrowse([this.browseDirBtn.nativeElement], true, false);
    this.flowHolder.assignDrop(this.dropArea.nativeElement);

    const id = '';
    const genericFileUploadUrl = this.genericDataService.getGenericFileUrl(this.genericData);
    this.flowHolder.opts.target = genericFileUploadUrl;

    const self = this;
    this.flowHolder.on('fileAdded', function (file, event) {
      if (file.name === '.DS_Store' || file.name === 'thumbs.db') {
        return false;
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

  getGenericFiles(): void {
    const paramsObservable = this.genericFilesParamsChange.asObservable();
    this.genericFiles = paramsObservable.pipe(
      switchMap((page) => {
        const params = {
          pageIndex: page.index,
          size: page.size,
          sort: page.sort
        };
        return this.genericDataService.getGenericFiles(this.genericData, params).pipe(
          map((paginatedResult) => {
            this.resultsLengthGenericFiles = paginatedResult.page.totalElements;
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
    this.genericDataService.lockGenericDataCollection(
      this.genericData).subscribe(genericData => {
      this.genericData = genericData;
    });
  }

  deleteCollection(): void {
    if (confirm('Are you sure you want to delete the collection ' + this.genericData.name + '?')) {
      this.genericDataService.deleteGenericDataCollection(this.genericData).subscribe(collection => {
        this.router.navigate(['generic-datas']);
      });
    }
  }

  deleteGenericFile(genericFile: GenericFile): void {
    this.genericDataService.deleteGenericFile(genericFile).subscribe(result => {
      this.$throttleRefresh.next();
    });
  }

  deleteAllGenericFiles(): void {
    this.genericDataService.deleteAllGenericFiles(this.genericData).subscribe(result => {
      this.$throttleRefresh.next();
    });
  }

  canEdit(): boolean {
    return this.keycloakService.canEdit(this.genericData);
  }
  
  makePublicCollection(): void {
    this.genericDataService.makePublicGenericDataCollection(
      this.genericData).subscribe(genericData => {
      this.genericData = genericData;
    }, error => {
      const modalRefErr = this.modalService.open(ModalErrorComponent);
      modalRefErr.componentInstance.title = 'Error while changing Collection visibility to public';
      modalRefErr.componentInstance.message = error.error;
    });
  }
    
  openDownload(url: string) {
    this.genericDataService.startDownload(url).subscribe(downloadUrl =>
      window.location.href = downloadUrl['url']);
  }
}
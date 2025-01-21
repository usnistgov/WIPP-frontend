import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { HttpResponse } from '@angular/common/http';
import { Job } from '../../job/job';
import { JobDetailComponent } from '../../job/job-detail/job-detail.component';
import { CsvCollectionService } from '../csv-collection.service';
import { CsvCollection } from '../csv-collection';
import { CsvCollectionDetailModalComponent } from "../csv-collection-detail-modal/csv-collection-detail-modal.component";
import { AppConfigService } from '../../app-config.service';
import { KeycloakService } from '../../services/keycloak/keycloak.service';
import { Csv } from '../csv';
import urljoin from 'url-join';
import { Observable, Subject } from 'rxjs';
import * as Flow from '@flowjs/flow.js';
import { auditTime, map, switchMap } from 'rxjs/operators';

import { DialogService } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-csv-collection-detail',
  templateUrl: './csv-collection-detail.component.html',
  styleUrls: ['./csv-collection-detail.component.css'],
  imports: [TableModule, ToastModule],
  providers: [DialogService, MessageService]
})
export class CsvCollectionDetailComponent implements OnInit, AfterViewInit, OnDestroy {

  csvCollection: CsvCollection = new CsvCollection();
  job: Job = null;
  csvCollectionId = this.route.snapshot.paramMap.get('id');
  plotsUiLink = '';
  uploadOption = 'regular';
  csv: Csv[];
  resultsLengthCsv = 0;

  $throttleRefresh: Subject<void> = new Subject<void>();
  flowHolder: Flow.IFlow;

  @ViewChild('browseBtn') browseBtn: ElementRef;
  @ViewChild('csvPaginator') csvPaginator: MatPaginator;

  constructor(
    private route: ActivatedRoute,
    private dialogService: DialogService,
    private messageService: MessageService,
    private router: Router,
    private csvCollectionService: CsvCollectionService,
    private appConfigService: AppConfigService,
    private keycloakService: KeycloakService) {
  }

  ngOnInit() {
    const self = this;
    if (this.appConfigService.getConfig().plotsUiUrl) {
      this.plotsUiLink = urljoin(this.appConfigService.getConfig().plotsUiUrl, 'plots', this.csvCollectionId);
    } else {
      this.plotsUiLink = null;
    }
    this.flowHolder = new Flow({
      uploadMethod: 'POST',
      method: 'octet',
      headers: function (file, chunk, isTest) {
        return { Authorization: `Bearer ${self.keycloakService.getKeycloakAuth().token}` };
      }
    });
    this.$throttleRefresh.pipe(
      auditTime(1000),
      switchMap(() => this.refresh()))
      .subscribe();
  }

  ngAfterViewInit() {
    this.refresh().subscribe(csvCollection => {
      if (this.canEdit() && !csvCollection.locked) {
        this.initFlow();
      }
    }, error => {
      this.router.navigate(['/404']);
    });
  }

  refresh() {
    return this.getCsvCollection().pipe(
      map(csvCollection => {
        this.csvCollection = csvCollection;
        this.getCsvFiles(null);
        if (this.csvCollection.numberImportingCsv !== 0) {
          this.$throttleRefresh.next();
        }
        this.getJob();
        return csvCollection;
      }));
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
    this.dialogService.open(JobDetailComponent, {
      header: 'Job detail',
      position: 'top',
      width: '50vw',
      data: {
        jobId: jobId
      },
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw'
      }
    });
  }

  makePublicCollection(): void {
    this.csvCollectionService.makePublicCsvCollection(
      this.csvCollection).subscribe(csvCollection => {
        this.csvCollection = csvCollection;
      }, error => {
        this.messageService.add({ severity: 'error', summary: 'Unable to change visibility to public', detail: error.error });
      });
  }
  initFlow(): void {
    this.flowHolder.assignBrowse([this.browseBtn.nativeElement], false, false, { 'accept': '.csv' });

    const id = this.route.snapshot.paramMap.get('id');
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

  getCsvFiles(event): void {
    this.csvCollectionService.getCsvFiles(this.csvCollection/*, params*/).subscribe(paginatedResult => {
      this.resultsLengthCsv = paginatedResult.page.totalElements;
      this.csv = paginatedResult.data;
    });
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

  deleteAllCsvFiles(): void {
    this.csvCollectionService.deleteAllCsvFiles(this.csvCollection).subscribe(result => {
      this.$throttleRefresh.next();
    });
  }

  deleteSingleCsvFile(csv: Csv): void {
    this.csvCollectionService.deleteCsvFile(csv).subscribe(result => {
      this.$throttleRefresh.next();
    });

    this.messageService.add({ severity: 'success', summary: 'Delete', detail: 'File ' + csv.fileName + ' deleted' });
  }

  canEdit(): boolean {
    return this.keycloakService.canEdit(this.csvCollection);
  }

  downloadAllCsvFiles(url: string) {
    this.csvCollectionService.startDownload(url).subscribe(downloadUrl =>
      window.location.href = downloadUrl['url']);
  }

  downloadSingleCsvFile(url: string, filename: string) {
    let path = url + "/csv/" + filename + "/downloadRequest";

    this.csvCollectionService.startDownload(path).subscribe(downloadUrl =>
      window.location.href = downloadUrl['url']
    );

    this.messageService.add({ severity: 'success', summary: 'Download', detail: 'File ' + filename + ' downloaded!' });
  }

  showSingleCsvFile(csv: Csv): void {
    this.csvCollectionService.getContent(csv)
      .subscribe(async (response: HttpResponse<Blob>) => {
        // get CSV file in form of byte[] from backend
        let body: string = await response.body["text"]();

        let content: string[][] = body.split('\n') // get each line of the CSV
          .map(v => v.split(',')); // get each element of each line

        let cols = content[0]; // first CSV line = columns
        content.shift(); // remove first line of content

        // popup
        this.dialogService.open(CsvCollectionDetailModalComponent, {
          header: "CSV file content",
          position: "top",
          width: "60vw",
          data: { lines: content, cols: cols }
        })
      });
  }

  ngOnDestroy() {
    this.dialogService.dialogComponentRefMap.forEach((dialog) => dialog.destroy());
  }

}

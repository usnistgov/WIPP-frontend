import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CsvCollection} from '../csv-collection';
import {CsvCollectionService} from '../csv-collection.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-csv-collection-new',
  templateUrl: './csv-collection-new.component.html',
  styleUrls: ['./csv-collection-new.component.css']
})
export class CsvCollectionNewComponent implements OnInit {

  csvCollection: CsvCollection = new CsvCollection();
  fileMaxSizeBytes = 30000000; // 30MB

  displayAlert = false;
  alertMessage = '';
  alertType = '';

  @ViewChild('browseBtn') browseBtn: ElementRef;
  @ViewChild('file') file: ElementRef;

  constructor(public activeModal: NgbActiveModal,
              private modalService: NgbModal,
              private csvCollectionService: CsvCollectionService,
              private router: Router) {
  }

  ngOnInit() {
  }

  onFileSelected(event) {
    let fileSize = 0;
    for (const file of event.target.files) {
      fileSize += file.size;
    }
    if (fileSize <= this.fileMaxSizeBytes) {
      this.displayAlert = false;
      this.csvCollection.files = event.target.files;
    } else {
      this.displayAlertMessage('danger', 'Cannot upload csv collection. ' + 'The size of the chosen files is ' + fileSize +
        ' B . The maximum size allowed is 30MB ( 30 000 000 B)');
      this.file.nativeElement.value = '';
      this.csvCollection.files = null;
    }
  }

  upload() {
    this.csvCollectionService.uploadFile(this.csvCollection)
      .subscribe(
        csvCollection => {
          this.displayAlertMessage('success', 'Success! Redirecting...');
          const csvCollectionId = csvCollection ? csvCollection.id : null;
          setTimeout(() => {
            this.router.navigate(['csv-collections', csvCollectionId]);
          }, 2000);
        },
        err => {
          this.displayAlertMessage('danger', 'Could not register CSV collection: ' + err.error);
        }
      );
  }

  displayAlertMessage(type, message) {
    this.alertMessage = message;
    this.alertType = type;
    this.displayAlert = true;
  }
}

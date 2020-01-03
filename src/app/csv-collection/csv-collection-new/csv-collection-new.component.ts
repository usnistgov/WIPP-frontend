import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {catchError} from 'rxjs/operators';
import {ModalErrorComponent} from '../../modal-error/modal-error.component';
import {throwError} from 'rxjs';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CsvCollection} from '../csv-collection';
import {CsvCollectionService} from '../csv-collection.service';

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
              private csvCollectionService: CsvCollectionService) {
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
      .pipe(
        catchError(err => {
          console.log('Handling error locally and rethrowing it...', err);
          this.activeModal.close(err);
          const modalRef = this.modalService.open(ModalErrorComponent);
          modalRef.componentInstance.title = 'Cannot upload csv collection.';
          modalRef.componentInstance.message = err.error.message;
          return throwError(err);
        })
      )
      .subscribe(
        csvCollection => {
          console.log(csvCollection);
          this.activeModal.close(csvCollection);
        },
        err => console.log('HTTP Error', err),
        () => console.log('HTTP request completed.')
      );
  }

  displayAlertMessage(type, message) {
    this.alertMessage = message;
    this.alertType = type;
    this.displayAlert = true;
  }
}

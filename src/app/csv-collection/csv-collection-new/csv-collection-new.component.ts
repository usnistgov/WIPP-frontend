import {Component, ElementRef, OnInit, ViewChild, Input} from '@angular/core';
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

  @Input() modalReference: any;

  csvCollection: CsvCollection = new CsvCollection();

  displayAlert = false;
  alertMessage = '';
  alertType = '';

  constructor(public activeModal: NgbActiveModal,
              private modalService: NgbModal,
              private csvCollectionService: CsvCollectionService,
              private router: Router) {
  }

  ngOnInit() {
  }

  createCollection() {
    this.csvCollectionService.createCsvCollection(this.csvCollection).subscribe(
      csvCollection => {
        this.displayAlertMessage('success', 'Success! Redirecting...');
        const csvCollectionId = csvCollection ? csvCollection.id : null;
        setTimeout(() => {
          this.router.navigate(['csv-collections', csvCollectionId]);
        }, 2000);
      },
      err => {
        this.displayAlertMessage('danger', 'Could not register csvCollection: ' + err.error.message);
      });
  }

  displayAlertMessage(type, message) {
    this.alertMessage = message;
    this.alertType = type;
    this.displayAlert = true;
  }
}

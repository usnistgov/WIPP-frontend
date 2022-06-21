import {Component, OnInit, Input} from '@angular/core';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {GenericDataCollection} from '../generic-data-collection'
import {GenericDataCollectionService} from '../generic-data-collection.service'
import {Router} from '@angular/router';

@Component({
  selector: 'app-generic-data-collection-new',
  templateUrl: './generic-data-collection-new.component.html',
  styleUrls: ['./generic-data-collection-new.component.css']
})
export class GenericDataCollectionNewComponent implements OnInit {

  @Input() modalReference: any;

  genericDataCollection: GenericDataCollection = new GenericDataCollection();

  displayAlert = false;
  alertMessage = '';
  alertType = '';

  constructor(public activeModal: NgbActiveModal,
              private modalService: NgbModal,
              private genericDataCollectionService: GenericDataCollectionService,
              private router: Router) {
  }

  ngOnInit() {
  }

  createCollection() {
    this.genericDataCollectionService.createGenericDataCollection(this.genericDataCollection).subscribe(
      genericDataCollection => {
        this.displayAlertMessage('success', 'Success! Redirecting...');
        const genericDataCollectionId = genericDataCollection ? genericDataCollection.id : null;
        setTimeout(() => {
          this.router.navigate([this.genericDataCollectionService.getGenericDataCollectionUiPath(), genericDataCollectionId]);
        }, 2000);
      },
      err => {
        this.displayAlertMessage('danger', 'Could not register Generic Data Collection: ' + err.error.message);
      });
  }

  displayAlertMessage(type, message) {
    this.alertMessage = message;
    this.alertType = type;
    this.displayAlert = true;
  }

}

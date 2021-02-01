import {Component, OnInit, Input} from '@angular/core';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {GenericData} from '../generic-data'
import {GenericDataService} from '../generic-data.service'
import {Router} from '@angular/router';

@Component({
  selector: 'app-generic-data-new',
  templateUrl: './generic-data-new.component.html',
  styleUrls: ['./generic-data-new.component.css']
})
export class GenericDataNewComponent implements OnInit {

  @Input() modalReference: any;

  genericData: GenericData = new GenericData();

  displayAlert = false;
  alertMessage = '';
  alertType = '';

  constructor(public activeModal: NgbActiveModal,
              private modalService: NgbModal,
              private genericDataService: GenericDataService,
              private router: Router) {
  }

  ngOnInit() {
  }

  createCollection() {
    console.log('createCollection');
    this.genericDataService.createGenericData(this.genericData).subscribe(
      genericData => {
        this.displayAlertMessage('success', 'Success! Redirecting...');
        const genericDataId = genericData ? genericData.id : null;
        setTimeout(() => {
          this.router.navigate(['generic-datas', genericDataId]);
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

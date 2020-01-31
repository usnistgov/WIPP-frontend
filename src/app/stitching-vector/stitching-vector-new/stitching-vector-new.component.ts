import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {StitchingVector} from '../stitching-vector';
import {StitchingVectorService} from '../stitching-vector.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-stitching-vector-new',
  templateUrl: './stitching-vector-new.component.html',
  styleUrls: ['./stitching-vector-new.component.css']
})
export class StitchingVectorNewComponent implements OnInit {

  stitchingVector: StitchingVector = new StitchingVector();
  fileMaxSizeBytes = 5000000;

  displayAlert = false;
  alertMessage = '';
  alertType = '';

  @ViewChild('browseBtn') browseBtn: ElementRef;
  @ViewChild('file') file: ElementRef;

  constructor(public activeModal: NgbActiveModal, private modalService: NgbModal,
              private stitchingVectorService: StitchingVectorService,
              private router: Router) {
  }

  ngOnInit() {
  }

  onFileSelected(event) {
    const fileSize = event.target.files[0].size;
    if (fileSize <= this.fileMaxSizeBytes) {
      this.displayAlert = false;
      this.stitchingVector.file = event.target.files[0];
    } else {
      this.displayAlertMessage('danger', 'Cannot upload stitching vector. ' + 'The size of the chosen file is ' + fileSize +
        ' B . The maximum size allowed is 5MB ( 5 000 000 B)');
      this.file.nativeElement.value = '';
      this.stitchingVector.file = null;
    }
  }

  upload() {
    this.stitchingVectorService.uploadFile(this.stitchingVector)
      .subscribe(
        stitchingVector => {
          this.displayAlertMessage('success', 'Success! Redirecting...');
          const stitchingVectorId = stitchingVector.id ? stitchingVector.id : null;
          setTimeout(() => {
          this.router.navigate(['stitching-vectors', stitchingVectorId]);
          }, 2000);
        },
        err => {
          this.displayAlertMessage('danger', 'Could not register stitching vector: ' + err.error);
        });
  }

  displayAlertMessage(type, message) {
    this.alertMessage = message;
    this.alertType = type;
    this.displayAlert = true;
  }
}

import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {StitchingVector} from '../stitching-vector';
import {StitchingVectorService} from '../stitching-vector.service';
import {throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {ModalErrorComponent} from '../../modal-error/modal-error.component';

@Component({
  selector: 'app-stitching-vector-new',
  templateUrl: './stitching-vector-new.component.html',
  styleUrls: ['./stitching-vector-new.component.css']
})
export class StitchingVectorNewComponent implements OnInit {

  stitchingVector: StitchingVector = new StitchingVector();

  @ViewChild('browseBtn') browseBtn: ElementRef;

  constructor(public activeModal: NgbActiveModal, private modalService: NgbModal,
              private stitchingVectorService: StitchingVectorService) {
  }

  ngOnInit() {
  }

  onFileSelected(event) {
    this.stitchingVector.file = event.target.files[0];
  }

  upload() {
    this.stitchingVectorService.uploadFile(this.stitchingVector)
      .pipe(
        catchError(err => {
          console.log('Handling error locally and rethrowing it...', err);
          this.activeModal.close(err);
          const modalRef = this.modalService.open(ModalErrorComponent);
          modalRef.componentInstance.title = 'Cannot upload stitching vector.';
          modalRef.componentInstance.name = err.error.message;
          return throwError(err);
        })
      )
      .subscribe(
        stitchingVector => {
          console.log(stitchingVector);
          this.activeModal.close(stitchingVector);
        },
        err => console.log('HTTP Error', err),
        () => console.log('HTTP request completed.')
      );
  }

}

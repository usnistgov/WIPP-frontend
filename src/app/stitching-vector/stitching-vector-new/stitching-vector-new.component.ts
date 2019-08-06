import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {StitchingVector} from '../stitching-vector';
import {StitchingVectorService} from '../stitching-vector.service';

@Component({
  selector: 'app-stitching-vector-new',
  templateUrl: './stitching-vector-new.component.html',
  styleUrls: ['./stitching-vector-new.component.css']
})
export class StitchingVectorNewComponent implements OnInit {

  stitchingVector: StitchingVector = new StitchingVector();

  @ViewChild('browseBtn') browseBtn: ElementRef;

  constructor(public activeModal: NgbActiveModal,
              private stitchingVectorService: StitchingVectorService) {
  }

  ngOnInit() {
  }

  onFileSelected(event) {
    this.stitchingVector.file = event.target.files[0];
  }

  upload() {
    this.stitchingVectorService.uploadFile(this.stitchingVector).subscribe(stitchingVector => {
      this.activeModal.close(stitchingVector);
    });
  }

}

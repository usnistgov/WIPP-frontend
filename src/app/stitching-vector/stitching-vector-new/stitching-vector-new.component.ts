import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {StitchingVector} from '../stitching-vector';
import {ActivatedRoute} from '@angular/router';
import {StitchingVectorService} from '../stitching-vector.service';

@Component({
  selector: 'app-stitching-vector-new',
  templateUrl: './stitching-vector-new.component.html',
  styleUrls: ['./stitching-vector-new.component.css']
})
export class StitchingVectorNewComponent implements OnInit {

 @Input() modalReference: any;

  stitchingVector: StitchingVector = new StitchingVector();

  @ViewChild('browseBtn') browseBtn: ElementRef;

  constructor(private activeModal: NgbActiveModal,
              private route: ActivatedRoute,
              private stitchingVectorService: StitchingVectorService
  ) { }

  ngOnInit() {
  }

  cancel() {
    this.modalReference.dismiss();
  }

  onFileSelected(event) {
    this.stitchingVector.file = event.target.files[0];
  }

  upload() {
    this.stitchingVectorService.uploadFile(this.stitchingVector);
      this.modalReference.close(this.stitchingVector);
  }

}

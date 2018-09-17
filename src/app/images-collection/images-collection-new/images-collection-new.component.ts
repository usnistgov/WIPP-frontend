import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ImagesCollection} from '../images-collection';

@Component({
  selector: 'app-images-collection-new',
  templateUrl: './images-collection-new.component.html',
  styleUrls: ['./images-collection-new.component.css']
})
export class ImagesCollectionNewComponent implements OnInit {

  @Input() modalReference: any;
  imagesCollection: ImagesCollection = new ImagesCollection();
  constructor(private activeModal: NgbActiveModal) { }

  ngOnInit() {
    this.imagesCollection.uploadOption = 'REGULAR';
  }
  cancel() {
    this.modalReference.dismiss();
  }
  save() {
    this.modalReference.close(this.imagesCollection);
  }

}

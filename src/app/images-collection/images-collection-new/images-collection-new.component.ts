import {Component, Input, NgModule, OnInit} from '@angular/core';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ImagesCollection, ImagesCollectionImportMethod} from '../images-collection';
import {AppConfigService} from '../../app-config.service';

@Component({
  selector: 'app-images-collection-new',
  templateUrl: './images-collection-new.component.html',
  styleUrls: ['./images-collection-new.component.css']
})
export class ImagesCollectionNewComponent implements OnInit {

  @Input() modalReference: any;
  imagesCollection: ImagesCollection = new ImagesCollection();
  usePattern = false;
  ImagesCollectionImportMethod = ImagesCollectionImportMethod;
  displayLocalImportOption = false;

  constructor(private activeModal: NgbActiveModal, private appConfigService: AppConfigService) {
    if (this.appConfigService.getConfig().displayLocalImportOption) {
      this.displayLocalImportOption = true;
    }
  }

  ngOnInit() {
    this.imagesCollection.importMethod = ImagesCollectionImportMethod.UPLOADED;
  }
  cancel() {
    this.modalReference.dismiss();
  }
  save() {
    this.modalReference.close(this.imagesCollection);
  }

}

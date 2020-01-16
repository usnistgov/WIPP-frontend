import {Component, Input, OnInit} from '@angular/core';
import {Visualization} from '../visualization';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-pyramid-visualization-new',
  templateUrl: './pyramid-visualization-new.component.html',
  styleUrls: ['./pyramid-visualization-new.component.css']
})
export class PyramidVisualizationNewComponent implements OnInit {

  @Input() modalReference: any;
  visualization: Visualization = new Visualization();
  constructor(private activeModal: NgbActiveModal) { }

  ngOnInit() {
  }
  cancel() {
    this.modalReference.dismiss();
  }
  save() {
    this.modalReference.close(this.visualization);
  }


}

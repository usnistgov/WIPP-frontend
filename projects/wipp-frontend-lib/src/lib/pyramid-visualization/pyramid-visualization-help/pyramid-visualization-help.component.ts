import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-pyramid-visualization-help',
  templateUrl: './pyramid-visualization-help.component.html',
  styleUrls: ['./pyramid-visualization-help.component.css']
})
export class PyramidVisualizationHelpComponent implements OnInit {

  @Input() modalReference: any;
  constructor(private activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  cancel() {
    this.modalReference.dismiss();
  }

}

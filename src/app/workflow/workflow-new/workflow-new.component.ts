import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Workflow} from '../workflow';

@Component({
  selector: 'app-workflow-new',
  templateUrl: './workflow-new.component.html',
  styleUrls: ['./workflow-new.component.css']
})
export class WorkflowNewComponent implements OnInit {

  @Input() modalReference: any;
  workflow: Workflow = new Workflow();
  constructor(private activeModal: NgbActiveModal) { }

  ngOnInit() {
  }
  cancel() {
    this.modalReference.dismiss();
  }
  save() {
    this.modalReference.close(this.workflow);
  }

}

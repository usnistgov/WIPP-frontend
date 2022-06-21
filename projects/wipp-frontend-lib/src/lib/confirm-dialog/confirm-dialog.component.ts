import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent implements OnInit {

  @Input() title: string;
  @Input() message: string;
  @Input() warnings: string[]

  constructor(
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
  }

  onConfirm(): void {
    this.activeModal.close(true);
  }

  onDismiss(): void {
    this.activeModal.close(false);
  }

}

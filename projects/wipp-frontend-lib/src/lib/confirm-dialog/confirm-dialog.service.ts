import { Injectable } from '@angular/core';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {ConfirmDialogComponent} from './confirm-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService {

  constructor(
    private modalService: NgbModal,
  ) { }

  createConfirmModal(title: string, message: string, warnings: string[]): NgbModalRef {
    const modalRefConfirm = this.modalService.open(ConfirmDialogComponent);
    modalRefConfirm.componentInstance.title = title;
    modalRefConfirm.componentInstance.message = message;
    modalRefConfirm.componentInstance.warnings = warnings;
    return modalRefConfirm;
  }
}

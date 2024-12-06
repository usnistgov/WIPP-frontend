import { Component, OnInit } from '@angular/core';
import 'rxjs-compat/add/operator/map';
import { DialogService, DynamicDialogComponent, DynamicDialogRef } from 'primeng/dynamicdialog';

export interface IdHash {
  [nameId: string]: string;
}

@Component({
  selector: 'app-ai-model-card-detail',
  templateUrl: './ai-model-card-detail.component.html',
  styleUrls: ['./ai-model-card-detail.component.css']
})

export class AiModelCardDetailComponent implements OnInit {

  instance: DynamicDialogComponent | undefined;

  aiModelId: string;
  content: string;

  constructor(
    public modalReference: DynamicDialogRef,
    private dialogService: DialogService
  ) {
    this.instance = this.dialogService.getInstance(this.modalReference);
  }

  ngOnInit() {
    if (this.instance && this.instance.data) {
      this.aiModelId = this.instance.data['aiModelId'];
      this.content = this.instance.data['content'];
    }
  }
}

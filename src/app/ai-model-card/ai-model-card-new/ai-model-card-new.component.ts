import { Component, OnInit } from '@angular/core';

import { AiModelCard } from '../ai-model-card';
import { AiModelCardService } from '../ai-model-card.service';
import { FRAMEWORKS, OPERATION_TYPES, ARCHITECTURES, LICENSES } from 'src/app/ai-model-data';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-ai-model-card-new',
  templateUrl: './ai-model-card-new.component.html',
  styleUrls: ['./ai-model-card-new.component.css']
})
export class AiModelCardNewComponent implements OnInit {
  form: AiModelCard = new AiModelCard();

  listFramework = FRAMEWORKS;
  listOperationType = OPERATION_TYPES;
  listArchitecture = ARCHITECTURES;
  listLicense = LICENSES;

  trainData: [key: string, val: string] = [null, null];
  trainParams: [key: string, val: string] = [null, null];

  constructor(public config: DynamicDialogConfig,
    private ref: DynamicDialogRef,
    private cardService: AiModelCardService,
    private messageService: MessageService) { }

  ngOnInit() { this.form.trainingData = {}; this.form.trainingParameters = {}; }

  cancel() { this.ref.close(); }

  // add then reset training form data or parameters
  addTraining(type: string, key: string, val: string) {
    if (type == "data") {
      this.form.trainingData[key] = val;
      this.trainData = [null, null];
    } else if (type == "params") {
      this.form.trainingParameters[key] = val;
      this.trainParams = [null, null];
    }
  }

  submit() {
    // link model and card
    this.form.aiModelId = this.config.data.modelId;
    // add date and version
    this.form.date = this.form.version = new Date();
    // create card
    this.cardService.postAiModelCard(this.form)
      .subscribe(card => {
        this.messageService.add({
          severity: 'success', summary: 'Success',
          detail: card.name + ' card created!'
        });
        // close dialog and refresh page
        setTimeout(() => { this.cancel(); window.location.reload(); }, 1000);
      }, err => {
        this.messageService.add({
          severity: 'error',
          summary: 'Could not upload AI model card',
          detail: err.error.message
        });
      });
  }

}

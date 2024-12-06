import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
// primeng
import { MessageService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { FileUpload } from 'primeng/fileupload';
// model
import { AiModel } from '../ai-model';
import { AiModelService } from '../ai-model.service';
import { frameworks, operation_types, architectures } from 'src/app/ai-model-data';
// card
import { AiModelCard } from 'src/app/ai-model-card/ai-model-card';
import { AiModelCardService } from 'src/app/ai-model-card/ai-model-card.service';

@Component({
  selector: 'app-ai-model-new',
  templateUrl: './ai-model-new.component.html',
  styleUrls: ['./ai-model-new.component.css'],
  providers: [MessageService]
})
export class AiModelNewComponent implements OnInit {

  formValid: boolean = false;

  newModel: AiModel = new AiModel();
  model_framework = frameworks;

  newCard: AiModelCard = new AiModelCard();
  list_operation_type = operation_types;
  list_architecture = architectures;

  inputs: [key: string, val: string] = [null, null];
  outputs: [key: string, val: string] = [null, null];

  @ViewChild('modelUpload') public modelUpload: FileUpload = null;

  constructor(
    private activeModal: DynamicDialogRef,
    private messageService: MessageService,
    private modelService: AiModelService,
    private cardService: AiModelCardService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.newCard.operationType = [];
    this.newCard.trainingData = {};
  }

  // notes: used when call `this.modelUpload.upload()`
  modelUploadCustom(files) {
    this.modelUpload.content = files[0];
  }

  cancel() { this.activeModal.close(); }

  add_data(type: string, val: string) {
    let i = Object.keys(this.newCard.trainingData).length;
    this.newCard.trainingData[type + '_' + i] = val;
    if (type == 'input') { this.inputs = [null, null]; }
    else { this.outputs = [null, null]; }
  }

  createModelAndCard() {
    this.modelUpload.upload();

    // check presence of a file
    if (this.modelUpload.content != null) {
      this.messageService.add({
        severity: 'success', summary: 'Success',
        detail: 'Form valid'
      });

      // create new model
      this.modelService.postAiModel(this.newModel)
        .subscribe(model => {
          this.messageService.add({
            severity: 'success', summary: 'Success',
            detail: 'New model uploaded!'
          });

          // save model files
          this.modelService.uploadAiModel(model, this.modelUpload)
            .subscribe(res => {
              this.messageService.add({
                severity: 'success', summary: 'Success',
                detail: "Model saved."
              });
            }, err => {
              this.messageService.add({
                severity: 'error',
                summary: 'Unable to upload model files',
                detail: err.error.message
              });
            });

          // fill-in new card
          const aiModelId = model ? model.id : null;
          this.newCard.version = this.newCard.date = model.creationDate;
          this.newCard.aiModelId = aiModelId;
          this.newCard.name = model.name;
          this.newCard.framework = model.framework;
          this.newCard.author = model.owner;
          this.newCard.publiclyShared = model.publiclyShared;

          // create new card
          this.cardService.postAiModelCard(this.newCard)
            .subscribe(card => {
              this.messageService.add({
                severity: 'success', summary: 'Success',
                detail: 'New model card created!'
              });
              this.messageService.add({
                severity: 'info', summary: 'Infos',
                detail: 'Redirecting...'
              });

              // redirection to new model
              setTimeout(() => {
                this.router.navigate(['ai-models', card.aiModelId]);
                this.cancel();
              }, 2000);
            }, err => {
              this.messageService.add({
                severity: 'error',
                summary: 'Could not upload AI model card',
                detail: err.error.message
              });
            });
        }, err => {
          this.messageService.add({
            severity: 'error',
            summary: 'Could not upload AI model',
            detail: err.error.message
          });
        });
    } else {

      // bad form
      this.messageService.add({
        severity: 'error', summary: 'Message',
        detail: "Form invalid: don't forget to upload a model"
      });
    }
  }

}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Job } from '../../job/job';
import { ActivatedRoute, Router } from '@angular/router';
import { AiModelService } from '../ai-model.service';
import { TensorboardLogs, AiModel } from '../ai-model';
import { JobDetailComponent } from '../../job/job-detail/job-detail.component';
import { AppConfigService } from '../../app-config.service';
import urljoin from 'url-join';
import { KeycloakService } from '../../services/keycloak/keycloak.service';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService } from 'primeng/api';

import { AiModelCard } from '../../ai-model-card/ai-model-card';
import { AiModelCardDetailComponent } from 'src/app/ai-model-card/ai-model-card-detail/ai-model-card-detail.component'
import { AiModelCardNewComponent } from 'src/app/ai-model-card/ai-model-card-new/ai-model-card-new.component';
import { AiModelCardService } from 'src/app/ai-model-card/ai-model-card.service';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { MessageService } from 'primeng/api';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-ai-model-detail',
  templateUrl: './ai-model-detail.component.html',
  styleUrls: ['./ai-model-detail.component.css'],
  providers: [DialogService, ConfirmationService, MessageService],
  imports: [FormsModule, DropdownModule, FileUploadModule, ToastModule]
})
export class AiModelDetailComponent implements OnInit, OnDestroy {
  aiFramework: string[] = ["TensorFlow", "HuggingFace", "BioImageIO",
    "CDCS record"];
  selectedFramework: string | undefined;

  aiModel: AiModel = new AiModel();
  aiModelId = this.route.snapshot.paramMap.get('id');
  aiModelCard: AiModelCard = new AiModelCard();
  aiModelCardPlotable: boolean = false;
  
  // dynamic edit model card
  form: FormGroup;
  editing: boolean;
  cancel: boolean;
  save: boolean;

  tensorboardLogs: TensorboardLogs = null;
  tensorboardLink = '';
  tensorboardPlotable: boolean = false;

  job: Job = null;

  chartdata_accu: { labels: string[], datasets: any[] };
  chartdata_loss: { labels: string[], datasets: any[] };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private appConfigService: AppConfigService,
    private aiModelService: AiModelService,
    private aiModelCardService: AiModelCardService,
    private keycloakService: KeycloakService,
    private formBuilder: FormBuilder,
  ) {
    this.editing = true;
    this.cancel = false;
    this.save = false;
  }

  /***** NgOn Methods *****/

  async ngOnInit(): Promise<void> {
    this.tensorboardLink = urljoin(this.appConfigService.getConfig().tensorboardUrl, '#scalars&regexInput=');

    // model
    try {
      const aiModel = await this.aiModelService.getById(this.aiModelId).toPromise();
      this.aiModel = aiModel;

      // job
      if (this.aiModel._links['sourceJob'] !== undefined) {
        const job = await this.aiModelService.getJob(this.aiModel._links['sourceJob']['href']).toPromise();
        this.job = job;

        // logs
        try {
          const logs = await this.aiModelService.getTensorboardLogsByJob(this.job.id).toPromise();
          this.tensorboardLogs = logs;
          this.tensorboardLink = this.tensorboardLink + this.tensorboardLogs.name;
          this.tensorboardPlotable = true;
          this.chartdata_accu = this.loadChart("accuracy");
          this.chartdata_loss = this.loadChart("loss");
        } catch (err) {

          // no logs
          this.messageService.add({ severity: 'info', summary: 'Info', detail: 'No logs associated with this job' });
        }
      } else {

        // no job
        this.messageService.add({ severity: 'info', summary: 'Info', detail: 'No job or logs associated with this AI model' });
      }
    } catch (err) {

      // no model
      this.router.navigate(['/404']);
    }

    // card
    try {
      const card = await this.aiModelCardService.getAiModelCard(this.aiModelId).toPromise();
      this.aiModelCard = card;
      this.aiModelCardPlotable = true;

      // form
      this.form = this.formBuilder.group({
        name: new FormControl(this.aiModelCard.name, Validators.required),
        author: new FormControl(this.aiModelCard.author, Validators.required),
        description: new FormControl(this.aiModelCard.description, Validators.required),
        citation: new FormControl(this.aiModelCard.citation, Validators.required),
      });
    } catch (err) {

      // no card
      this.messageService.add({ severity: 'info', summary: 'Info', detail: 'No AI model card associated with this model' });
    }
  }

  ngOnDestroy() {
    this.dialogService.dialogComponentRefMap.forEach((dialog) => dialog.destroy());
  }

  /***** TensorBoard Methods *****/

  displayJobModal(jobId: string) {
    this.dialogService.open(JobDetailComponent, {
      header: 'Job detail',
      position: 'top',
      width: '50vw',
      data: { jobId: jobId },
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw'
      }
    });
  }

  loadChart(tag: string) {
    let tensorboard_id = this.tensorboardLogs.id;
    let labels: string[] = [];
    let test = { label: 'test', data: [] };
    this.aiModelService
      .getTensorboardlogsCSV(tensorboard_id, "test", tag)
      .subscribe(data => {
        // remove headers; get epochs and values
        for (let v of data.slice(1)) {
          labels.push(v[1]);
          test.data.push(v[2]);
        }
      });

    let train = { label: 'train', data: [] };
    this.aiModelService
      .getTensorboardlogsCSV(tensorboard_id, "train", tag)
      .subscribe(data => {
        for (let v of data.slice(1)) {
          train.data.push(v[2]);
        }
      });

    let chartdata = { labels: labels, datasets: [test, train] };
    return chartdata;
  }

  /***** AiModel Methods *****/

  makePublicAiModel(): void {
    this.aiModelService
      .makePublicAiModel(this.aiModel)
      .subscribe(aiModel => { this.aiModel = aiModel; });
  }

  openDownload(url: string) {
    this.aiModelService
      .startDownload(url)
      .subscribe(downloadUrl => window.location.href = downloadUrl['url']);
  }

  popupDeleteModel(): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the AI model <b>' + this.aiModel.name + '</b> created on <b>' + this.aiModel.creationDate + '</b>?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonStyleClass: "p-button-text",
      accept: () => {
        // card
        this.deleteAiModelCard();

        // model
        this.aiModelService.deleteAiModel(this.aiModel)
          .subscribe(aimodel => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'AI Model deleted' });
            this.router.navigate(['ai-models']);
          });
      }
    });
  }

  /***** AiModelCard Methods *****/

  getHttpFromCurrentFramework(id: string): Observable<HttpResponse<Blob>> {
    switch (this.selectedFramework) {
      case "TensorFlow": return this.aiModelCardService.exportTensorflow(id);
      case "HuggingFace": return this.aiModelCardService.exportHuggingface(id);
      case "BioImageIO": return this.aiModelCardService.exportBioimageio(id);
      case "CDCS record": return this.aiModelCardService.exportCDCS(id);
      default:
        alert("ERROR: you can't take any action on this framework.");
        return null;
    }
  }

  displayAiModelCardModal(aiModelId: string) {
    // get
    this.getHttpFromCurrentFramework(aiModelId)
      .subscribe(async (response: HttpResponse<Blob>) => {
        let content: string = await response.body['text']();
        // display
        this.dialogService.open(AiModelCardDetailComponent, {
          header: 'Preview for ' + this.selectedFramework,
          position: 'top',
          width: '50vw',
          data: {
            aiModelId: aiModelId,
            content: content
          },
          breakpoints: {
            '960px': '75vw',
            '640px': '90vw'
          }
        });
      });
  }

  displayNewAiModelCardModel() {
    this.dialogService.open(AiModelCardNewComponent, {
      header: 'Fill-in AI model card',
      position: 'top',
      width: '50vw',
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw'
      }, 
      data: {modelId: this.aiModelId},
    });
  }

  exportAiModelCard(id: string): void {
    // get content
    this.getHttpFromCurrentFramework(id)
      .subscribe((response: HttpResponse<Blob>) => {
        const contentDisposition = response.headers.get('content-disposition');
        // retrieve file name
        const filename: string = contentDisposition.split('; filename="')[1].trim();
        // save file
        saveAs(response.body, filename);
      });
  }

  deleteAiModelCard() {
    this.aiModelCardService.deleteAiModelCard(this.aiModelCard)
      .subscribe(aimodelcard => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Model card deleted' });
        this.aiModelCardPlotable = false;
      }, err => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Model card suppression failed' });
      });
  }

  toggleEdit() {
    this.editing = !this.editing;
    this.cancel = !this.cancel;
    this.save = !this.save;
  }

  toggleCancel() {
    this.toggleEdit();

    this.form.setValue(this.aiModelCard);
  }

  toggleSave() {
    this.toggleEdit();

    // to optimize before merge
    this.aiModelCard.name = this.form.get('name').value;
    this.aiModelCard.author = this.form.get('author').value;
    this.aiModelCard.description = this.form.get('description').value;
    this.aiModelCard.citation = this.form.get('citation').value;
   
    this.aiModelCardService.updateAiModelCard(this.aiModelCard)
      .subscribe(mc => this.aiModelCard = mc);
  }

  /***** Keycloak Methods *****/

  canEdit(): boolean {
    return this.keycloakService.canEdit(this.aiModel);
  }

}

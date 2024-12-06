import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AiModelListComponent } from './ai-model-list/ai-model-list.component';
import { AiModelDetailComponent } from './ai-model-detail/ai-model-detail.component';
import { AiModelRoutingModule } from './ai-model-routing.module';
import { AiModelTemplateComponent } from './ai-model-template/ai-model-template.component';
import { AiModelNewComponent } from './ai-model-new/ai-model-new.component';
import { TensorboardLogsTemplateComponent } from './ai-model-template/tensorboard-logs-template.component';

import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FieldsetModule } from 'primeng/fieldset';
import { TooltipModule } from 'primeng/tooltip';
import { ChartModule } from 'primeng/chart';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { FileUploadModule } from 'primeng/fileupload';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputGroupModule } from 'primeng/inputgroup';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AiModelRoutingModule,
    TableModule,
    ToastModule,
    ButtonModule,
    InputTextModule,
    FieldsetModule,
    TooltipModule,
    ChartModule,
    DropdownModule,
    CheckboxModule,
    FileUploadModule,
    DialogModule,
    ConfirmDialogModule,
    MultiSelectModule,
    InputTextareaModule,
    InputGroupModule,
  ],
  declarations: [
    AiModelListComponent,
    AiModelDetailComponent,
    AiModelTemplateComponent,
    AiModelNewComponent,
    TensorboardLogsTemplateComponent
  ]
})
export class AiModelModule { }

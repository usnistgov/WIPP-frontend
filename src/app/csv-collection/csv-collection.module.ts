import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CsvCollectionListComponent } from './csv-collection-list/csv-collection-list.component';
import { CsvCollectionDetailComponent } from './csv-collection-detail/csv-collection-detail.component';
import { CsvCollectionDetailModalComponent } from './csv-collection-detail-modal/csv-collection-detail-modal.component';
import { CsvCollectionRoutingModule } from './csv-collection-routing.module';
import { CsvCollectionTemplateComponent } from './csv-collection-template/csv-collection-template.component';
import { CsvCollectionNewComponent } from './csv-collection-new/csv-collection-new.component';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FieldsetModule } from 'primeng/fieldset';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressBarModule } from 'primeng/progressbar';
import { CustomPipesModule } from '../custom-pipes/custom-pipes.module';

@NgModule({
  imports: [
    CommonModule,
    CsvCollectionRoutingModule,
    FormsModule,
    TableModule,
    ToastModule,
    ButtonModule,
    InputTextModule,
    FieldsetModule,
    TooltipModule,
    ProgressBarModule,
    CustomPipesModule
  ],
  declarations: [
    CsvCollectionDetailComponent,
    CsvCollectionDetailModalComponent,
    CsvCollectionListComponent,
    CsvCollectionNewComponent,
    CsvCollectionTemplateComponent
  ]
})
export class CsvCollectionModule { }

import { Component, OnInit } from '@angular/core';
import { AiModel } from '../ai-model';
import { AiModelService } from '../ai-model.service';
import { DialogService } from 'primeng/dynamicdialog';
import { AiModelNewComponent } from '../ai-model-new/ai-model-new.component';

@Component({
  selector: 'app-ai-model-list',
  templateUrl: './ai-model-list.component.html',
  styleUrls: ['./ai-model-list.component.css'],
  providers: [DialogService]
})
export class AiModelListComponent implements OnInit {
  aiModels: AiModel[];
  resultsLength = 0;
  pageSize = 10;

  constructor(
    private aiModelService: AiModelService,
    private dialogService: DialogService,
  ) {
  }

  ngOnInit() {}

  getAiModels(event) {
    const sortOrderStr = event?.sortOrder == -1 ? 'desc' : 'asc';
    const sortField = event?.sortField ? event.sortField + ',' + sortOrderStr : 'creationDate,desc';
    const params = {
      pageIndex: event.first / event.rows,
      size: event.rows,
      sort: sortField
    };
    if (event?.filters?.global?.value) {
      this.aiModelService.getByNameContainingIgnoreCase(params, event.filters.global.value).subscribe(result => {
        this.aiModels = result.data;
        this.resultsLength = result.page.totalElements;
      });
    } else {
      this.aiModelService.get(params).subscribe(result => {
        this.aiModels = result.data;
        this.resultsLength = result.page.totalElements;
      });
    }
  }

  displayNewAimodelModal() {
    this.dialogService.open(AiModelNewComponent, {
      header: 'New AI model',
      position: 'top',
      width: '50vw',
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw'
      }
    });
  }

}


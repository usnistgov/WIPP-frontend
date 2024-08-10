import { Component } from '@angular/core';
import {Router} from '@angular/router';
import {KeycloakService} from '../../services/keycloak/keycloak.service';
import {DialogService} from 'primeng/dynamicdialog';
import {MessageService} from 'primeng/api';
import {ImageAnnotationsCollection} from '../image-annotations-collection';
import {ImageAnnotationsService} from '../image-annotations.service';

@Component({
  selector: 'app-image-annotations-list',
  templateUrl: './image-annotations-list.component.html',
  styleUrl: './image-annotations-list.component.css',
  providers: [DialogService, MessageService]
})
export class ImageAnnotationsListComponent {

  imageAnnotationsCollections: ImageAnnotationsCollection[];

  resultsLength = 0;
  pageSize = 10;

  constructor(
    private imageAnnotationsService: ImageAnnotationsService,
    private router: Router,
    private keycloakService: KeycloakService,
    private dialogService: DialogService
  ) {}

  loadData(event) {
    const sortOrderStr = event?.sortOrder == -1 ? 'desc' : 'asc';
    const sortField = event?.sortField ? event.sortField + ',' + sortOrderStr : 'creationDate,desc';
    const pageIndex = event ? event.first / event.rows : 0;
    const pageSize = event ? event.rows : this.pageSize;
    const params = {
      pageIndex: pageIndex,
      size: pageSize,
      sort: sortField
    };
    if(event?.filters?.global?.value) {
      this.imageAnnotationsService.getByNameContainingIgnoreCase(params, event.filters.global.value).subscribe(result => {
        this.imageAnnotationsCollections = result.data;
        this.resultsLength = result.page.totalElements;
      });
    } else {
      this.imageAnnotationsService.get(params).subscribe(result => {
        this.imageAnnotationsCollections = result.data;
        this.resultsLength = result.page.totalElements;
      });
    }
  }

  ngOnDestroy() {
    this.dialogService.dialogComponentRefMap.forEach((dialog) => dialog.destroy());
  }

}

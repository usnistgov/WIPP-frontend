import { Component } from '@angular/core';
import {MessageService} from 'primeng/api';
import {DialogService, DynamicDialogComponent, DynamicDialogRef} from 'primeng/dynamicdialog';
import {AppConfigService} from '../../app-config.service';
import {ImagesCollectionService} from '../images-collection.service';
import {Router} from '@angular/router';
import {Image} from '../image';
import {ImagesCollection} from '../images-collection';
import {Label} from '../../image-annotations/image-annotation';
import {ImageAnnotationsService} from '../../image-annotations/image-annotations.service';
import {ImageAnnotationsCollection} from '../../image-annotations/image-annotations-collection';
import {AutoCompleteCompleteEvent} from 'primeng/autocomplete';
import {dataMap} from '../../data-service';

@Component({
  selector: 'app-images-collection-create-annot-task',
  templateUrl: './images-collection-create-annot-task.component.html',
  styleUrl: './images-collection-create-annot-task.component.css',
  providers: [MessageService]
})
export class ImagesCollectionCreateAnnotTaskComponent {

  instance: DynamicDialogComponent | undefined;

  imageAnnotationsCollection: ImageAnnotationsCollection = new ImageAnnotationsCollection();

  imagesCollectionId: string;
  imagesCollection: ImagesCollection;

  labels: Label[] = [];
  availableImages: Image[];
  selectedImages: Image[];

  masksCollection: ImagesCollection;
  availableMasksCollections: Array<ImagesCollection>;

  userAssignees: string[] = [];
  segmentSize: number;

  resultsLengthImages = 0;

  allImagesSelected: boolean = false;

  labelAddDisplay: boolean = true;
  labelName: string = '';
  labelColor: string = '#B3B3B3';

  constructor(public modalReference: DynamicDialogRef,
              private messageService: MessageService,
              private dialogService: DialogService,
              private imageAnnotationsService: ImageAnnotationsService,
              private imagesCollectionService: ImagesCollectionService,
              private router: Router) {
    this.instance = this.dialogService.getInstance(this.modalReference);
  }

  ngOnInit() {
    if (this.instance && this.instance.data) {
      this.imagesCollectionId = this.instance.data['imagesCollectionId'];
      this.imagesCollectionService.getById(this.imagesCollectionId).subscribe(result => {
        this.imagesCollection = result;
      });
    }
  }

  loadImages(event) {
    const sortOrderStr = event.sortOrder == -1 ? 'desc' : 'asc';
    const sortField = event.sortField ? event.sortField + ',' + sortOrderStr : 'fileName,asc';
    const params = {
      pageIndex: event.first / event.rows,
      size: event.rows,
      sort: sortField
    };
    this.imagesCollectionService.getImages(this.imagesCollection, params).subscribe(val => {
        this.resultsLengthImages = val.page.totalElements;
        this.availableImages = val.data;
    });
  }

  cancel() {
    this.modalReference.close();
  }

  postConfiguration() {
    this.imageAnnotationsService.setupAnnotationTask(this.imageAnnotationsCollection.name, this.labels, this.segmentSize)
      .subscribe(result => {
        let taskId = result.taskId;
        this.imageAnnotationsCollection.taskId = taskId;
        this.imageAnnotationsService.createAnnotationsCollection(this.imageAnnotationsCollection).subscribe(annotCollection => {
          let annotationList = [];
          for (let selectedImg of this.selectedImages) {
            annotationList.push({
              imageFileName: selectedImg.fileName,
              imagesCollectionId: this.imagesCollectionId,
              imageAnnotationsCollection: annotCollection.id,
              pending: true
            });
          }
          console.log(annotationList);
          this.imageAnnotationsService.addAnnotations(annotCollection, annotationList).subscribe();
          this.imageAnnotationsService.uploadToAnnotationTask(annotationList, taskId, this.userAssignees).subscribe();
        });
      });
  }

  addLabel() {
    this.labels.push({ name: this.labelName, color: this.labelColor});
    this.resetLabelForm();
  }

  resetLabelForm() {
    this.labelAddDisplay = true;
    this.labelName = '';
    this.labelColor = '#B3B3B3';
  }

  removeLabel(label: Label) {
    this.labels.splice(this.labels.indexOf(label),1);
  }

  filterImgColl(event: AutoCompleteCompleteEvent) {
    this.imagesCollectionService.getByNameContainingIgnoreCase(null, event.query).subscribe(result => {
      this.availableMasksCollections = result.data;
    });
  }
}

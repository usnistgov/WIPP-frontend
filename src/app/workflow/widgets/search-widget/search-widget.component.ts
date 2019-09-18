import {Component, OnInit, ViewChild} from '@angular/core';
import {StringWidget} from 'ngx-schema-form';
import {NgbTypeahead} from '@ng-bootstrap/ng-bootstrap';
import {WorkflowService} from '../../workflow.service';
import {Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, map, switchMap} from 'rxjs/operators';
import {ImagesCollectionService} from '../../../images-collection/images-collection.service';
import {StitchingVectorService} from '../../../stitching-vector/stitching-vector.service';
import {TensorflowModelService} from '../../../tensorflow-model/tensorflow-model.service';
import {CsvCollectionService} from '../../../csv-collection/csv-collection.service';

@Component({
  selector: 'app-search-widget',
  templateUrl: './search-widget.component.html',
  styleUrls: ['./search-widget.component.css']
})
export class SearchWidgetComponent extends StringWidget {
  @ViewChild('instance') instance: NgbTypeahead;

  constructor(
    private workflowService: WorkflowService,
    private imagesCollectionService: ImagesCollectionService,
    private stitchingVectorService: StitchingVectorService,
    private tensorflowModelService: TensorflowModelService,
    private csvCollectionService: CsvCollectionService
  ) {
    super();
  }

  filter(term) {
    if (this.schema === null || this.schema.format === null) {
      return [];
    }

    switch (this.schema.format) {
      case 'collection':
        return this.imagesCollectionService.getImagesCollectionsByNameContainingIgnoreCase(null, term).pipe(map(result => {
          let collections = this.schema.getOutputCollections();
          collections = collections.concat(result.imagesCollections);
          return collections;
        }));
      case 'stitchingVector':
        return this.stitchingVectorService.getStitchingVectorsByNameContainingIgnoreCase(null, term).pipe(map(result => {
          let stitchingVectors = this.schema.getOutputStitchingVectors();
          stitchingVectors = stitchingVectors.concat(result.stitchingVectors);
          return stitchingVectors;
        }));
      case 'tensorflowModel':
        return this.tensorflowModelService.getTensorflowModelsByNameContainingIgnoreCase(null, term).pipe(map(result => {
          let tensorflowModels = this.schema.getOutputTensorflowModels();
          tensorflowModels = tensorflowModels.concat(result.tensorflowModels);
          return tensorflowModels;
        }));
      case 'csvCollection':
        return this.csvCollectionService.getCsvCollectionsByNameContainingIgnoreCase(null, term).pipe(map(result => {
          let csvCollections = this.schema.getOutputCsvCollections();
          csvCollections = csvCollections.concat(result.csvCollections);
          return csvCollections;
        }));
      default:
        return [];
    }
  }

  search = (text$: Observable<string>) => text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    switchMap(term => this.filter(term))
  )

  formatter = (x: {name: string}) => x.name;
}

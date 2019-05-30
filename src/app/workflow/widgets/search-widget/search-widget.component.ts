import {Component, ViewChild} from '@angular/core';
import {StringWidget} from 'ngx-schema-form';
import {NgbTypeahead} from '@ng-bootstrap/ng-bootstrap';
import {WorkflowService} from '../../workflow.service';
import {forkJoin, Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, map, switchMap} from 'rxjs/operators';
import {ImagesCollectionService} from '../../../images-collection/images-collection.service';
import {StitchingVectorService} from '../../../stitching-vector/stitching-vector.service';

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
    private stitchingVectorService: StitchingVectorService
  ) {
    super();
  }

  filter(term) {
    if (this.schema === null || this.schema.format === null) {
      return [];
    }

    switch (this.schema.format) {
      case 'collection':
        return forkJoin(this.imagesCollectionService.getImagesCollectionsByNameContainingIgnoreCase(null, term),
          this.schema.getOutput()).pipe(map(([res1, res2]) => {
          const collections = res1.imagesCollections.concat(res2['collection']);
          return collections;
        }));
      case 'stitchingVector':
        return forkJoin(this.stitchingVectorService.getStitchingVectorsByNameContainingIgnoreCase(null, term),
          this.schema.getOutput()).pipe(map(([res1, res2]) => {
          const collections = res1.stitchingVectors.concat(res2['stitchingVector']);
          return collections;
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

  formatter = (x: { name: string }) => x.name;
}

import {ImagesCollectionService} from './images-collection/images-collection.service';
import {StitchingVectorService} from './stitching-vector/stitching-vector.service';
import {CsvCollectionService} from './csv-collection/csv-collection.service';
import {NotebookService} from './notebook/notebook.service';
import {TensorflowModelService} from './tensorflow-model/tensorflow-model.service';
import {PyramidService} from './pyramid/pyramid.service';
import {PyramidAnnotationService} from './pyramid-annotation/pyramid-annotation.service';
import {Observable} from 'rxjs';
import { GenericDataService } from './generic-data/generic-data.service';


export interface DataService<T, U> {
  getById(id): Observable<T>;
  get(params): Observable<U>;
  getByNameContainingIgnoreCase(params, name): Observable<U>;
}

export const dataMap = new Map<string, any>([
  ['stitchingVector', StitchingVectorService],
  ['pyramidAnnotation', PyramidAnnotationService],
  ['collection', ImagesCollectionService],
  ['csvCollection', CsvCollectionService],
  ['notebook', NotebookService],
  ['tensorflowModel', TensorflowModelService],
  ['pyramid', PyramidService],
  ['genericData', GenericDataService]
]);



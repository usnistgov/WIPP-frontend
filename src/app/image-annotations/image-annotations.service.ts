import { Injectable } from '@angular/core';
import {DataService} from '../data-service';
import {ImageAnnotationsCollection, PaginatedImageAnnotationsCollections} from './image-annotations-collection';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';
import {Job} from '../job/job';
import {ImageAnnotation, Label, PaginatedImageAnnotations} from './image-annotation';
import {ImagesCollection} from '../images-collection/images-collection';


@Injectable({
  providedIn: 'root'
})
export class ImageAnnotationsService implements DataService<ImageAnnotationsCollection, PaginatedImageAnnotationsCollections> {

  private imageAnnotationsCollectionsUrl = environment.apiRootUrl + '/imageAnnotationsCollections';
  private imageAnnotationsApiUrl = environment.annotationApiRootUrl; // Python Annotation API URL

  constructor(
    private http: HttpClient
  ) { }

  get(params): Observable<PaginatedImageAnnotationsCollections> {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      params: {}
    };
    if (params) {
      const page = params.pageIndex ? params.pageIndex : null;
      const size = params.size ? params.size : null;
      const sort = params.sort ? params.sort : null;
      const httpParams = new HttpParams().set('page', page).set('size', size).set('sort', sort);
      httpOptions.params = httpParams;
    }
    return this.http.get<any>(this.imageAnnotationsCollectionsUrl, httpOptions).pipe(
      map((result: any) => {
        result.data = result._embedded.imageAnnotationsCollections;
        return result;
      }));
  }

  getById(id): Observable<ImageAnnotationsCollection> {
    return this.http.get<ImageAnnotationsCollection>(`${this.imageAnnotationsCollectionsUrl}/${id}`);
  }

  getByNameContainingIgnoreCase(params, name): Observable<PaginatedImageAnnotationsCollections> {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      params: {}
    };
    let httpParams = new HttpParams().set('name', name);
    if (params) {
      const page = params.pageIndex ? params.pageIndex : null;
      const size = params.size ? params.size : null;
      const sort = params.sort ? params.sort : null;
      httpParams = httpParams.set('page', page).set('size', size).set('sort', sort);
    }
    httpOptions.params = httpParams;
    return this.http.get<any>(this.imageAnnotationsCollectionsUrl + '/search/findByNameContainingIgnoreCase', httpOptions).pipe(
      map((result: any) => {
        result.data = result._embedded.imageAnnotationsCollections;
        return result;
      }));
  }

  getAnnotations(id: string, params): Observable<PaginatedImageAnnotations> {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      params: {}
    };
    if (params) {
      const page = params.pageIndex ? params.pageIndex : null;
      const size = params.size ? params.size : null;
      const httpParams = new HttpParams().set('page', page).set('size', size);
      httpOptions.params = httpParams;
    }
    return this.http.get<any>(`${this.imageAnnotationsCollectionsUrl}/${id}/annotations`, httpOptions).pipe(
      map((result: any) => {
        result.data = result._embedded.imageAnnotations;
        return result;
      }));
  }

  getJob(jobUrl: string): Observable<Job> {
    return this.http.get<Job>(jobUrl);
  }

  createAnnotationsCollection(annotationsCollection: ImageAnnotationsCollection): Observable<ImageAnnotationsCollection> {
    return this.http.post<ImageAnnotationsCollection>(this.imageAnnotationsCollectionsUrl, annotationsCollection);
  }

  addAnnotations(annotationsCollection: ImageAnnotationsCollection, annotations: ImageAnnotation[]): Observable<PaginatedImageAnnotations> {
    return this.http.post<any>(`${this.imageAnnotationsCollectionsUrl}/${annotationsCollection.id}/annotations`, annotations);
  }

  setupAnnotationTask(name: string, labels: Label[], segmentSize: number): Observable<any> {
    // Example of implementation
    // return this.http.post<any>(`${this.imageAnnotationsApiUrl}/create`, {
    //   organization: {
    //     slug: "WIPP"
    //   },
    //   task: {
    //     name: name,
    //     labels: labels,
    //     segmentSize: segmentSize
    //   },
    // });

    return of({ taskId: 1141 });
  }

  uploadToAnnotationTask(annotationList: ImageAnnotation[], taskId: string, userAssigneesname: string[]): Observable<any> {
    // Example of implementation
    // return this.http.post<any>(`${this.imageAnnotationsApiUrl}/upload`, {
    //   taskId: taskId,
    //   userAssignees: userAssignees,
    //   data: annotationList
    // });

    return of({ taskId: 1141 });
  }
}

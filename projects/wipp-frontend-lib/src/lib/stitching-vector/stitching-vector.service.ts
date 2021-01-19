import {Injectable, Inject} from '@angular/core';
import {PaginatedStitchingVector, StitchingVector} from './stitching-vector';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {PaginatedTimeSlices} from './timeSlice';
import {Job} from '../job/job';
import {DataService} from '../data-service';
import { ENV } from '../injection-token';

@Injectable({
  providedIn: 'root'
})
export class StitchingVectorService implements DataService<StitchingVector, PaginatedStitchingVector> {
  private stitchingVectorsUrl = this.env.apiRootUrl + '/stitchingVectors';
  private stitchingVectorUiPath = this.env.uiPaths.stitchingVectorsPath;

  constructor(
    @Inject(ENV) private env: any,
    private http: HttpClient) {
  }

  uploadFile(stitchingVector: StitchingVector): Observable<StitchingVector> {
    const formData = new FormData();
    formData.append('file', stitchingVector.file, stitchingVector.file.name);
    formData.append('name', stitchingVector.name);
    stitchingVector.note ? formData.append('message', stitchingVector.note) : formData.append('message', '');

    return this.http.post<StitchingVector>(this.stitchingVectorsUrl + '/upload', formData);
  }

  getById(id: string): Observable<StitchingVector> {
    return this.http.get<StitchingVector>(`${this.stitchingVectorsUrl}/${id}`);
  }

  get(params): Observable<PaginatedStitchingVector> {
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
    return this.http.get<any>(this.stitchingVectorsUrl, httpOptions).pipe(
      map((result: any) => {
        result.data = result._embedded.stitchingVectors;
        return result;
      }));
  }

  getByNameContainingIgnoreCase(params, name): Observable<PaginatedStitchingVector> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
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
    return this.http.get<any>(this.stitchingVectorsUrl + '/search/findByNameContainingIgnoreCase', httpOptions).pipe(
      map((result: any) => {
        result.data = result._embedded.stitchingVectors;
        return result;
      }));
  }

  getTimeSlices(id: string, params): Observable<PaginatedTimeSlices> {
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
    return this.http.get<any>(`${this.stitchingVectorsUrl}/${id}/timeSlices`, httpOptions).pipe(
      map((result: any) => {
        result.data = result._embedded.stitchingVectorTimeSlices;
        return result;
      }));
  }

  getJob(jobUrl: string): Observable<Job> {
    return this.http.get<Job>(jobUrl);
  }

  getStitchingVectorUiPath(): string {
    return this.stitchingVectorUiPath;
  }

}

import {Injectable} from '@angular/core';
import {PaginatedStitchingVector, StitchingVector} from './stitching-vector';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {PaginatedTimeSlices} from './timeSlice';
import {Job} from '../job/job';

@Injectable({
  providedIn: 'root'
})
export class StitchingVectorService {
  private stitchingVectorsUrl = environment.apiRootUrl + '/stitchingVectors';

  constructor(
    private http: HttpClient) {
  }

  uploadFile(stitchingVector: StitchingVector): Observable<StitchingVector> {
    const formData = new FormData();
    formData.append('file', stitchingVector.file, stitchingVector.file.name);
    formData.append('name', stitchingVector.name);
    stitchingVector.note ? formData.append('message', stitchingVector.note) : formData.append('message', '');

    return this.http.post<StitchingVector>(this.stitchingVectorsUrl + '/upload', formData);
  }

  getStitchingVector(id: string): Observable<StitchingVector> {
    return this.http.get<StitchingVector>(`${this.stitchingVectorsUrl}/${id}`);
  }

  getStitchingVectors(params): Observable<PaginatedStitchingVector> {
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
        result.stitchingVectors = result._embedded.stitchingVectors;
        return result;
      }));
  }

  getStitchingVectorsByNameContainingIgnoreCase(params, name): Observable<PaginatedStitchingVector> {
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
        result.stitchingVectors = result._embedded.stitchingVectors;
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
        result.timeSlices = result._embedded.stitchingVectorTimeSlices;
        return result;
      }));
  }

  getJob(jobUrl: string): Observable<Job> {
    return this.http.get<Job>(jobUrl);
  }

  makePublicStitchingVector(stitchingVector: StitchingVector): Observable<StitchingVector> {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      params: {}
    };
    return this.http.patch<StitchingVector>(`${this.stitchingVectorsUrl}/${stitchingVector.id}`, {publiclyAvailable: true}, httpOptions);
  }

}

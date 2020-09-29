import {Injectable, Inject} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {DataService} from '../data-service';
import {PaginatedPyramidAnnotation, PyramidAnnotation} from './pyramid-annotation';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {PaginatedTimeSlices} from '../stitching-vector/timeSlice';
import {Job} from '../job/job';
import { API_ROOT_URL } from '../injection-token';

@Injectable({
  providedIn: 'root'
})
export class PyramidAnnotationService implements DataService<PyramidAnnotation, PaginatedPyramidAnnotation> {
  private pyramidAnnotationsUrl = this.apiRootUrl + '/pyramidAnnotations';

  constructor(
    @Inject(API_ROOT_URL) private apiRootUrl: string,
    private http: HttpClient) {
  }

  get(params): Observable<PaginatedPyramidAnnotation> {
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
    return this.http.get<any>(this.pyramidAnnotationsUrl, httpOptions).pipe(
      map((result: any) => {
        result.data = result._embedded.pyramidAnnotations;
        return result;
      }));
  }

  getById(id): Observable<PyramidAnnotation> {
    return this.http.get<PyramidAnnotation>(`${this.pyramidAnnotationsUrl}/${id}`);
  }

  getByNameContainingIgnoreCase(params, name): Observable<PaginatedPyramidAnnotation> {
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
    return this.http.get<any>(this.pyramidAnnotationsUrl + '/search/findByNameContainingIgnoreCase', httpOptions).pipe(
      map((result: any) => {
        result.data = result._embedded.pyramidAnnotations;
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
    return this.http.get<any>(`${this.pyramidAnnotationsUrl}/${id}/timeSlices`, httpOptions).pipe(
      map((result: any) => {
        result.data = result._embedded.pyramidAnnotationTimeSlices;
        return result;
      }));
  }

}

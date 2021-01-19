import { Injectable, Inject } from '@angular/core';
import {DataService} from '../data-service';
import {GenericData, PaginatedGenericDatas} from './generic-data';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Job} from '../job/job';
import { ENV } from '../injection-token';

@Injectable({
  providedIn: 'root'
})
export class GenericDataService implements DataService<GenericData, PaginatedGenericDatas> {

  private genericDataUrl = this.env.apiRootUrl + '/genericDatas';
  private genericDataUiPath = this.env.uiPaths.genericDatasPath;

  constructor(
    @Inject(ENV) private env: any,
    private http: HttpClient) { 
  }

  getById(id: string): Observable<GenericData> {
    return this.http.get<GenericData>(`${this.genericDataUrl}/${id}`);
  }

  get(params): Observable<PaginatedGenericDatas> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: {}
    };
    if (params) {
      const page = params.pageIndex ? params.pageIndex : null;
      const size = params.size ? params.size : null;
      const sort = params.sort ? params.sort : null;
      const httpParams = new HttpParams().set('page', page).set('size', size).set('sort', sort);
      httpOptions.params = httpParams;
    }
    return this.http.get<any>(this.genericDataUrl, httpOptions).pipe(
      map((result: any) => {
        result.data = result._embedded.genericDatas;
        return result;
      }));
  }

  getByNameContainingIgnoreCase(params, name): Observable<PaginatedGenericDatas> {
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
    return this.http.get<any>(this.genericDataUrl + '/search/findByNameContainingIgnoreCase', httpOptions).pipe(
      map((result: any) => {
        result.data = result._embedded.genericDatas;
        return result;
      }));
  }

  getJob(jobUrl: string): Observable<Job> {
    return this.http.get<Job>(jobUrl);
  }

  getGenericDataUiPath(): string {
    return this.genericDataUiPath;
  }
}

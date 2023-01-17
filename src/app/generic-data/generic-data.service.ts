import { Injectable } from '@angular/core';
import {DataService} from '../data-service';
import {GenericData, PaginatedGenericDatas} from './generic-data';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Job} from '../job/job';
import { GenericFile, PaginatedGenericFiles } from './generic-file';

@Injectable({
  providedIn: 'root'
})
export class GenericDataService implements DataService<GenericData, PaginatedGenericDatas> {

  private genericDataUrl = environment.apiRootUrl + '/genericDataCollections';

  constructor(private http: HttpClient) { }

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
        result.data = result._embedded.genericDataCollections;
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
        result.data = result._embedded.genericDataCollections;
        return result;
      }));
  }

  createGenericData(genericData: GenericData): Observable<GenericData> {
    console.log('createGenericDataService');
    return this.http.post<GenericData>(this.genericDataUrl, genericData);
  }

  getJob(jobUrl: string): Observable<Job> {
    return this.http.get<Job>(jobUrl);
  }

  makeDataPublic(genericData: GenericData): Observable<GenericData> {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      params: {}
    };
    return this.http.patch<GenericData>(`${this.genericDataUrl}/${genericData.id}`, {publiclyShared: true}, httpOptions);
  }

  startDownload(url: string): Observable<string> {
    return this.http.get<string>(url);
  }

  getGenericFiles(genericData: GenericData, params): Observable<PaginatedGenericFiles> {
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
    return this.http.get<GenericFile>(`${this.genericDataUrl}/${genericData.id}/genericFile`, httpOptions).pipe(
      map((result: any) => {
        result.data = result._embedded.genericFiles;
        return result;
      }));
  }

    getGenericFileUrl(genericData: GenericData): string {
      return `${this.genericDataUrl}/${genericData.id}/genericFile`;
  }

  lockGenericDataCollection(genericData: GenericData): Observable<GenericData> {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      params: {}
    };
    return this.http.patch<GenericData>(`${this.genericDataUrl}/${genericData.id}`, {locked: true}, httpOptions);
  }

  deleteGenericDataCollection(genericData: GenericData) {
    return this.http.delete<GenericData>(genericData._links.self.href);
  }

  deleteGenericFile(genericFile: GenericFile) {
    return this.http.delete<GenericFile>(genericFile._links.self.href);
  }

  deleteAllGenericFiles(genericData: GenericData) {
    if (genericData.numberOfFiles > 0) {
      return this.http.delete(`${this.genericDataUrl}/${genericData.id}/genericFile`);
    }
  }

}

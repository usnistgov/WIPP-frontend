import { Injectable, Inject } from '@angular/core';
import {DataService} from '../data-service';
import {GenericDataCollection, PaginatedGenericDataCollections} from './generic-data-collection';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Job} from '../job/job';
import { ENV } from '../injection-token';
import { GenericFile, PaginatedGenericFiles } from './generic-file';

@Injectable({
  providedIn: 'root'
})
export class GenericDataCollectionService implements DataService<GenericDataCollection, PaginatedGenericDataCollections> {

  private genericDataCollectionUrl = this.env.apiRootUrl + '/genericDataCollections';
  private genericDataCollectionUiPath = this.env.uiPaths.genericDataCollectionsPath;

  constructor(
    @Inject(ENV) private env: any,
    private http: HttpClient) { 
  }

  getById(id: string): Observable<GenericDataCollection> {
    return this.http.get<GenericDataCollection>(`${this.genericDataCollectionUrl}/${id}`);
  }

  get(params): Observable<PaginatedGenericDataCollections> {
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
    return this.http.get<any>(this.genericDataCollectionUrl, httpOptions).pipe(
      map((result: any) => {
        result.data = result._embedded.genericDataCollections;
        return result;
      }));
  }

  getByNameContainingIgnoreCase(params, name): Observable<PaginatedGenericDataCollections> {
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
    return this.http.get<any>(this.genericDataCollectionUrl + '/search/findByNameContainingIgnoreCase', httpOptions).pipe(
      map((result: any) => {
        result.data = result._embedded.genericDataCollections;
        return result;
      }));
  }

  createGenericDataCollection(genericDataCollection: GenericDataCollection): Observable<GenericDataCollection> {
    return this.http.post<GenericDataCollection>(this.genericDataCollectionUrl, genericDataCollection);
  }

  getJob(jobUrl: string): Observable<Job> {
    return this.http.get<Job>(jobUrl);
  }

  getGenericDataCollectionUiPath(): string {
    return this.genericDataCollectionUiPath;
  }

  getGenericFiles(genericDataCollection: GenericDataCollection, params): Observable<PaginatedGenericFiles> {
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
    return this.http.get<GenericFile>(`${this.genericDataCollectionUrl}/${genericDataCollection.id}/genericFile`, httpOptions).pipe(
      map((result: any) => {
        result.data = result._embedded.genericFiles;
        return result;
      }));
  }

  getGenericFileUrl(genericDataCollection: GenericDataCollection): string {
      return `${this.genericDataCollectionUrl}/${genericDataCollection.id}/genericFile`;
  }

  lockGenericDataCollection(genericDataCollection: GenericDataCollection): Observable<GenericDataCollection> {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      params: {}
    };
    return this.http.patch<GenericDataCollection>(`${this.genericDataCollectionUrl}/${genericDataCollection.id}`, {locked: true}, httpOptions);
  }

  deleteGenericDataCollection(genericDataCollection: GenericDataCollection) {
    return this.http.delete<GenericDataCollection>(genericDataCollection._links.self.href);
  }

  deleteGenericFile(genericFile: GenericFile) {
    return this.http.delete<GenericFile>(genericFile._links.self.href);
  }

  deleteAllGenericFiles(genericDataCollection: GenericDataCollection) {
    if (genericDataCollection.numberOfFiles > 0) {
      return this.http.delete(`${this.genericDataCollectionUrl}/${genericDataCollection.id}/genericFile`);
    }
  }

  makePublicGenericDataCollection(genericDataCollection: GenericDataCollection): Observable<GenericDataCollection> {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      params: {}
    };
    return this.http.patch<GenericDataCollection>(`${this.genericDataCollectionUrl}/${genericDataCollection.id}`, {publiclyShared: true}, httpOptions);
  }

  startDownload(url: string): Observable<string> {
    return this.http.get<string>(url);
  }
  
}

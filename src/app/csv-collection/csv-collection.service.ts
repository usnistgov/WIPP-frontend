import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Job} from '../job/job';
import {CsvCollection, PaginatedCsvCollections} from './csv-collection';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CsvCollectionService {

  private csvCollectionUrl = environment.apiRootUrl + '/csvCollections';

  constructor(private http: HttpClient) { }

  getCsvCollection(id: string): Observable<CsvCollection> {
    return this.http.get<CsvCollection>(`${this.csvCollectionUrl}/${id}`);
  }

  getCsvCollections(params): Observable<PaginatedCsvCollections> {
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
    return this.http.get<any>(this.csvCollectionUrl, httpOptions).pipe(
      map((result: any) => {
        result.csvCollections = result._embedded.csvCollections;
        return result;
      }));
  }

  getCsvCollectionsByNameContainingIgnoreCase(params, name): Observable<PaginatedCsvCollections> {
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
    return this.http.get<any>(this.csvCollectionUrl + '/search/findByNameContainingIgnoreCase', httpOptions).pipe(
      map((result: any) => {
        result.csvCollections = result._embedded.csvCollections;
        return result;
      }));
  }

  getJob(jobUrl: string): Observable<Job> {
    return this.http.get<Job>(jobUrl);
  }

  uploadFile(csvCollection: CsvCollection): Observable<CsvCollection> {
    const formData = new FormData();
    for (const file of csvCollection.files) {
      formData.append('files', file, file.name);
    }
    formData.append('name', csvCollection.name);

    return this.http.post<CsvCollection>(this.csvCollectionUrl + '/upload', formData);
  }

}

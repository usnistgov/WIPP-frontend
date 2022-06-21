import { Injectable, Inject } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Job} from '../job/job';
import {CsvCollection, PaginatedCsvCollections} from './csv-collection';
import {DataService} from '../data-service';
import {Csv, PaginatedCsv} from './csv';
import { ENV } from '../injection-token';
import { WippFrontendLibConfigurationProvider } from '../wipp-frontend-lib-configuration';

@Injectable({
  providedIn: 'root'
})
export class CsvCollectionService implements DataService<CsvCollection, PaginatedCsvCollections> {

  private csvCollectionUrl = this.env.apiRootUrl + '/csvCollections';
  private plotsUiUrl = this.configurationProvider.config.plotsUiUrl;
  private csvCollectionUiPath = this.env.uiPaths.csvCollectionsPath;

  constructor(
    @Inject(ENV) private env: any,
    public configurationProvider: WippFrontendLibConfigurationProvider,
    private http: HttpClient) { 
  }

  getById(id: string): Observable<CsvCollection> {
    return this.http.get<CsvCollection>(`${this.csvCollectionUrl}/${id}`);
  }

  get(params): Observable<PaginatedCsvCollections> {
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
        result.data = result._embedded.csvCollections;
        return result;
      }));
  }

  getByNameContainingIgnoreCase(params, name): Observable<PaginatedCsvCollections> {
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
        result.data = result._embedded.csvCollections;
        return result;
      }));
  }

  createCsvCollection(csvCollection: CsvCollection): Observable<CsvCollection> {
    return this.http.post<CsvCollection>(this.csvCollectionUrl, csvCollection);
  }

  getJob(jobUrl: string): Observable<Job> {
    return this.http.get<Job>(jobUrl);
  }

  getCsvFiles(csvCollection: CsvCollection, params): Observable<PaginatedCsv> {
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
    return this.http.get<Csv>(`${this.csvCollectionUrl}/${csvCollection.id}/csv`, httpOptions).pipe(
      map((result: any) => {
        result.data = result._embedded.csvs;
        return result;
      }));
  }

  getCsvUrl(csvCollection: CsvCollection): string {
      return `${this.csvCollectionUrl}/${csvCollection.id}/csv`;
  }

  lockCsvCollection(csvCollection: CsvCollection): Observable<CsvCollection> {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      params: {}
    };
    return this.http.patch<CsvCollection>(`${this.csvCollectionUrl}/${csvCollection.id}`, {locked: true}, httpOptions);
  }

  deleteCsvCollection(csvCollection: CsvCollection) {
    return this.http.delete<CsvCollection>(csvCollection._links.self.href);
  }

  deleteCsvFile(csv: Csv) {
    return this.http.delete<Csv>(csv._links.self.href);
  }

  deleteAllCsvFiles(csvCollection: CsvCollection) {
    if (csvCollection.numberOfCsvFiles > 0) {
      return this.http.delete(`${this.csvCollectionUrl}/${csvCollection.id}/csv`);
    }
  }

  getPlotsUiUrl(): string {
    return this.plotsUiUrl;
  }

  getCsvCollectionUiPath(): string {
    return this.csvCollectionUiPath;
  }

  makePublicCsvCollection(csvCollection: CsvCollection): Observable<CsvCollection> {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      params: {}
    };
    return this.http.patch<CsvCollection>(`${this.csvCollectionUrl}/${csvCollection.id}`, {publiclyShared: true}, httpOptions);
  }

  startDownload(url: string): Observable<string> {
    return this.http.get<string>(url);
  }
}

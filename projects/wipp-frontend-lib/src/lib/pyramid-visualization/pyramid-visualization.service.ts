import { Injectable, Inject } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {PaginatedVisualization, Visualization} from './visualization';
import {map} from 'rxjs/operators';
import { ENV } from '../injection-token';

@Injectable({
  providedIn: 'root'
})
export class PyramidVisualizationService {

  private visualizationsUrl = this.env.apiRootUrl + '/visualizations';
  private visualizationsUiPath = this.env.uiPaths.visualizationsPath;
  private pyramidUiPath = this.env.uiPaths.pyramidsPath;

  constructor(
    @Inject(ENV) private env: any,
    private http: HttpClient
  ) { }

  getVisualization(id: string): Observable<Visualization> {
    return this.http.get<Visualization>(`${this.visualizationsUrl}/${id}`);
  }

  getVisualizations(params): Observable<PaginatedVisualization> {
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
    return this.http.get<any>(this.visualizationsUrl, httpOptions).pipe(
      map((result: any) => {
        result.data = result._embedded.visualizations;
        return result;
      }));
  }

  getVisualizationsByNameContainingIgnoreCase(params, name): Observable<PaginatedVisualization> {
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
    return this.http.get<any>(this.visualizationsUrl + '/search/findByNameContainingIgnoreCase', httpOptions).pipe(
      map((result: any) => {
        result.data = result._embedded.visualizations;
        return result;
      }));
  }

  createVisualization(visualization: Visualization): Observable<Visualization> {
    return this.http.post<Visualization>(this.visualizationsUrl, visualization);
  }

  setVisualizationManifest(visualization: Visualization, manifest: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: {}
    };
    return this.http.patch<Visualization>(`${this.visualizationsUrl}/${visualization.id}`, {manifest: manifest}, httpOptions);
  }

  getVisualizationUiPath(): string {
    return this.visualizationsUiPath;
  }

  getPyramidUiPath(): string {
    return this.pyramidUiPath;
  }

  makePublicVisualization(visualization: Visualization): Observable<Visualization> {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      params: {}
    };
    return this.http.patch<Visualization>(`${this.visualizationsUrl}/${visualization.id}`, {publiclyShared: true}, httpOptions);
  }

  startDownload(url: string): Observable<string> {
    return this.http.get<string>(url);
  }

}

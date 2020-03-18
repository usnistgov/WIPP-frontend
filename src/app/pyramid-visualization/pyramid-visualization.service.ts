import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {PaginatedVisualization, Visualization} from './visualization';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PyramidVisualizationService {

  private visualizationsUrl = environment.apiRootUrl + '/visualizations';

  constructor(
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

  makePublicVisualization(visualization: Visualization): Observable<Visualization> {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      params: {}
    };
    return this.http.patch<Visualization>(`${this.visualizationsUrl}/${visualization.id}`, {publiclyAvailable: true}, httpOptions);
  }

}

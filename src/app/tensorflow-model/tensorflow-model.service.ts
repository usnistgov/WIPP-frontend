import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {PaginatedTensorflowModels, TensorflowModel} from './tensorflow-model';
import {Job} from '../job/job';

@Injectable({
  providedIn: 'root'
})
export class TensorflowModelService {

  private tensorflowModelUrl = environment.apiRootUrl + '/tensorflowModels';

  constructor(private http: HttpClient) { }

  getTensorflowModel(id: string): Observable<TensorflowModel> {
    return this.http.get<TensorflowModel>(`${this.tensorflowModelUrl}/${id}`);
  }

  getTensorflowModels(params): Observable<PaginatedTensorflowModels> {
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
    return this.http.get<any>(this.tensorflowModelUrl, httpOptions).pipe(
      map((result: any) => {
        result.tensorflowModels = result._embedded.tensorflowModels;
        return result;
      }));
  }

  getTensorflowModelsByNameContainingIgnoreCase(params, name): Observable<PaginatedTensorflowModels> {
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
    return this.http.get<any>(this.tensorflowModelUrl + '/search/findByNameContainingIgnoreCase', httpOptions).pipe(
      map((result: any) => {
        result.tensorflowModels = result._embedded.tensorflowModels;
        return result;
      }));
  }

  getJob(jobUrl: string): Observable<Job> {
    return this.http.get<Job>(jobUrl);
  }
}

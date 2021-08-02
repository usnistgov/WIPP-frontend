import { Injectable, Inject } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {PaginatedTensorflowModels, TensorboardLogs, TensorflowModel} from './tensorflow-model';
import {Job} from '../job/job';
import {DataService} from '../data-service';
import { WippFrontendLibConfigurationProvider } from '../wipp-frontend-lib-configuration';
import { ENV } from '../injection-token';

@Injectable({
  providedIn: 'root'
})
export class TensorflowModelService implements DataService<TensorflowModel, PaginatedTensorflowModels> {

  private tensorflowModelUrl = this.env.apiRootUrl + '/tensorflowModels';
  private tensorboardLogsUrl = this.env.apiRootUrl + '/tensorboardLogs';
  private tensorboardUrl = this.configurationProvider.config.tensorboardUrl;
  private tensorflowModelUiPath = this.env.uiPaths.tensorflowModelsUiPath;

  constructor(
    @Inject(ENV) private env: any,
    public configurationProvider: WippFrontendLibConfigurationProvider,
    private http: HttpClient) { }

  getById(id: string): Observable<TensorflowModel> {
    return this.http.get<TensorflowModel>(`${this.tensorflowModelUrl}/${id}`);
  }

  get(params): Observable<PaginatedTensorflowModels> {
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
        result.data = result._embedded.tensorflowModels;
        return result;
      }));
  }

  getByNameContainingIgnoreCase(params, name): Observable<PaginatedTensorflowModels> {
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
        result.data = result._embedded.tensorflowModels;
        return result;
      }));
  }

  getJob(jobUrl: string): Observable<Job> {
    return this.http.get<Job>(jobUrl);
  }

  getTensorboardLogsByJob(jobId: string): Observable<TensorboardLogs> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: {}
    };
    const httpParams = new HttpParams().set('sourceJob', jobId);
    httpOptions.params = httpParams;
    return this.http.get<any>(this.tensorboardLogsUrl + '/search/findOneBySourceJob', httpOptions).pipe(
      map((result: any) => {
        return result;
      }));
  }

  getTensorboardUrl(): string {
    return this.tensorboardUrl;
  }

  getTensorflowUiPath(): string {
    return this.tensorflowModelUiPath;
  }

  makePublicTensorflowModel(tensorflowModel: TensorflowModel): Observable<TensorflowModel> {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      params: {}
    };
    return this.http.patch<TensorflowModel>(`${this.tensorflowModelUrl}/${tensorflowModel.id}`, {publiclyShared: true}, httpOptions);
  }

  startDownload(url: string): Observable<string> {
    return this.http.get<string>(url);
  }
}

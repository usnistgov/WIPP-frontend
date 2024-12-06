import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PaginatedAiModels, TensorboardLogs, AiModel } from './ai-model';
import { Job } from '../job/job';
import { DataService } from '../data-service';
import { FileUpload } from 'primeng/fileupload';

@Injectable({
  providedIn: 'root'
})
export class AiModelService implements DataService<AiModel, PaginatedAiModels> {

  private aiModelUrl = environment.apiRootUrl + '/aiModels';
  private tensorboardLogsUrl = environment.apiRootUrl + '/tensorboardLogs';

  constructor(private http: HttpClient) { }

  getJob(jobUrl: string): Observable<Job> {
    return this.http.get<Job>(jobUrl);
  }

  /***** AI Model Services *****/

  getById(id: string): Observable<AiModel> {
    return this.http.get<AiModel>(`${this.aiModelUrl}/${id}`);
  }

  get(params): Observable<PaginatedAiModels> {
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
    return this.http.get<any>(this.aiModelUrl, httpOptions).pipe(
      map((result: any) => {
        result.data = result._embedded.aiModels;
        return result;
      }));
  }

  getByNameContainingIgnoreCase(params, name): Observable<PaginatedAiModels> {
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
    return this.http.get<any>(this.aiModelUrl + '/search/findByNameContainingIgnoreCase', httpOptions).pipe(
      map((result: any) => {
        result.data = result._embedded.aiModels;
        return result;
      }));
  }

  makePublicAiModel(AiModel: AiModel): Observable<AiModel> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: {}
    };
    return this.http.patch<AiModel>(`${this.aiModelUrl}/${AiModel.id}`, { publiclyShared: true }, httpOptions);
  }

  startDownload(url: string): Observable<string> {
    return this.http.get<string>(url);
  }

  postAiModel(aiModel: AiModel): Observable<AiModel> {
    return this.http.post<AiModel>(this.aiModelUrl, aiModel);
  }

  deleteAiModel(aiModel: AiModel) {
    return this.http.delete<AiModel>(aiModel._links.self.href);
  }

  uploadAiModel(aiModel: AiModel, content: FileUpload): Observable<AiModel> {
    const formData = new FormData();
    formData.append('file', content._files[0], content.name);
    return this.http.post<AiModel>(`${this.aiModelUrl}/${aiModel.id}/upload`, formData);
  }

  /***** TensorBoard Services *****/

  getTensorboardLogsByJob(jobId: string): Observable<TensorboardLogs> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: {},
    };
    const httpParams = new HttpParams().set('sourceJob', jobId);
    httpOptions.params = httpParams;
    return this.http
      .get<any>(this.tensorboardLogsUrl + '/search/findOneBySourceJob', httpOptions)
      .pipe(map((result: any) => { return result; }));
  }

  getTensorboardlogsCSV(id: string, type: string, tag: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: new HttpParams().set('type', type).set('tag', tag)
    };
    return this.http.get<any>(`${this.tensorboardLogsUrl}/${id}/get/csv`, httpOptions);
  }

}

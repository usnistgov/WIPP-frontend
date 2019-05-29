import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {HttpParams} from '../../../node_modules/@angular/common/http';
import {map} from 'rxjs/operators';
import {PaginatedWorkflows, Workflow} from './workflow';
import {Job, PaginatedJobs} from '../job/job';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'}),
  params: {}
};

@Injectable({providedIn: 'root'})
export class WorkflowService {
  constructor(
    private http: HttpClient
  ) {
  }

  private workflowsUrl = environment.apiRootUrl + '/workflows';
  private jobsUrl = environment.apiRootUrl + '/jobs';

  getWorkflows(params): Observable<PaginatedWorkflows> {
    if (params) {
      const page = params.pageIndex ? params.pageIndex : null;
      const size = params.size ? params.size : null;
      const httpParams = new HttpParams().set('page', page).set('size', size);
      httpOptions.params = httpParams;
    }
    return this.http.get<any>(this.workflowsUrl, httpOptions).pipe(
      map((result: any) => {
        result.workflows = result._embedded.workflows;
        return result;
      }));
  }

  getWorkflow(id: string): Observable<Workflow> {
    return this.http.get<Workflow>(`${this.workflowsUrl}/${id}`);
  }

  // getSchemaForm(pluginName: string): Observable<Object> {
  //   httpOptions.params = null;
  //   return this.http.post<Object>(
  //     this.workflowsUrl + '/search-ngx',
  //     {'name': pluginName},
  //     httpOptions
  //   );
  // }

  // getCollections(): string[] {
  //   return this.collection.concat(this.outputCollection);
  // }
  //
  // addCollection(collectionName): void {
  //   this.outputCollection.push(collectionName);
  // }
  //
  // resetCollection(): void {
  //   this.outputCollection = [];
  // }

  createWorkflow(workflow: Workflow): Observable<Workflow> {
    return this.http.post<Workflow>(this.workflowsUrl, workflow);
  }

  createJob(job): Observable<Job> {
    return this.http.post<Job>(this.jobsUrl, job);
  }

  modifyJob(job): Observable<Job> {
    return this.http.patch<Job>(`${this.jobsUrl}/${job.id}`, job);
  }

  submitWorkflow(workflow): Observable<Workflow> {
    return this.http.post<Workflow>(
      `${this.workflowsUrl}/${workflow.id}/submit`,
      null,
      httpOptions
    );
  }

  getJobs(workflow: Workflow, params): Observable<PaginatedJobs> {
    if (params) {
      const page = params.pageIndex ? params.pageIndex : null;
      const size = params.size ? params.size : null;
      const wippWorkflow = workflow.id ? workflow.id : null;
      const httpParams = new HttpParams().set('wippWorkflow', wippWorkflow).set('page', page).set('size', size);
      httpOptions.params = httpParams;
    }
    return this.http.get<any>(`${this.jobsUrl}/search/findByWippWorkflow`, httpOptions).pipe(
      map((result: any) => {
        result.jobs = result._embedded.jobs;
        return result;
      }));
  }
}

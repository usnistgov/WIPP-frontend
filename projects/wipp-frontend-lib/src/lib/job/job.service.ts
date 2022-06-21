import {Injectable, Inject} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Job} from './job';
import {Plugin} from '../plugin/plugin';
import {ImagesCollection} from '../images-collection/images-collection';
import {StitchingVector} from '../stitching-vector/stitching-vector';
import {Workflow} from '../workflow/workflow';
import { ENV } from '../injection-token';


const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'}),
  params: {}
};

@Injectable({
  providedIn: 'root'
})

export class JobService {

  constructor(    
    @Inject(ENV) private env: any,
    private http: HttpClient) {
  }

  private jobsUrl = this.env.apiRootUrl + '/jobs';
  private imagesCollection = this.env.apiRootUrl + '/imagesCollections';
  private stitchingVector = this.env.apiRootUrl + '/stitchingVectors';
  private pluginsUrl = this.env.apiRootUrl + '/plugins';
  private workflowsUrl = this.env.apiRootUrl + '/workflows';

  private workflowsUiPath = this.env.uiPaths.workflowsPath;
  private pluginsUiPath = this.env.uiPaths.pluginsPath;

  getJob(jobId: string): Observable<Job> {
    return this.http.get<Job>(`${this.jobsUrl}/${jobId}`, httpOptions);
  }

  getPlugin(pluginId): Observable<Plugin> {
    return this.http.get<Plugin>(`${this.pluginsUrl}/${pluginId}`, httpOptions);
  }

  getImagesCollection(imagesCollectionId): Observable<ImagesCollection> {
    return this.http.get<ImagesCollection>(`${this.imagesCollection}/${imagesCollectionId}`, httpOptions);
  }

  getStitchingVector(stitchingVectorId): Observable<StitchingVector> {
    return this.http.get<StitchingVector>(`${this.stitchingVector}/${stitchingVectorId}`, httpOptions);
  }

  getWorkflow(workflowId: string) {
    return this.http.get<Workflow>(`${this.workflowsUrl}/${workflowId}`, httpOptions);
  }

  deleteJob(job: Job) {
     return this.http.delete<Job>(job._links.self.href);
  }

  getWorkflowsUiPath(): string {
    return this.workflowsUiPath;
  }

  getPluginsUiPath(): string {
    return this.pluginsUiPath;
  }

}

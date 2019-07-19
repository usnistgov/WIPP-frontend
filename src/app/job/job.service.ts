import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {Job} from './job';
import {Plugin} from '../plugin/plugin';
import {ImagesCollection} from '../images-collection/images-collection';
import {StitchingVector} from '../stitching-vector/stitching-vector';


const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'}),
  params: {}
};

@Injectable({
  providedIn: 'root'
})

export class JobService {

  constructor(private http: HttpClient) {
  }

  private jobsUrl = environment.apiRootUrl + '/jobs';
  private imagesCollection = environment.apiRootUrl + '/imagesCollections';
  private stitchingVector = environment.apiRootUrl + '/stitchingVectors';
  private pluginsUrl = environment.apiRootUrl + '/plugins';

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

}

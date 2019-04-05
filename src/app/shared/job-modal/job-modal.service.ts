import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Plugin} from '../../plugin/plugin';
import {Observable} from 'rxjs';
import {Job} from './job';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'}),
  params: {}
};

@Injectable({
  providedIn: 'root'
})

export class JobModalService {

  constructor(private http: HttpClient) {
  }

  private jobsUrl = environment.apiRootUrl + '/jobs';
  private pluginsUrl = environment.apiRootUrl + '/plugins';

  getJob(jobId: string): Observable<Job> {
    return this.http.get<Job>(`${this.jobsUrl}/${jobId}`, httpOptions);
  }

  getPlugin(pluginId): Observable<Plugin> {
    return this.http.get<Plugin>(`${this.pluginsUrl}/${pluginId}`, httpOptions);
  }

}

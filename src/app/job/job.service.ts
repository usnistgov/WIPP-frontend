import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {Job} from './job';
import {Plugin} from '../plugin/plugin';


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
  private pluginsUrl = environment.apiRootUrl + '/plugins';

  getJob(jobId: string): Observable<Job> {
    return this.http.get<Job>(`${this.jobsUrl}/${jobId}`, httpOptions);
  }

  getPlugin(pluginId): Observable<Plugin> {
    return this.http.get<Plugin>(`${this.pluginsUrl}/${pluginId}`, httpOptions);
  }

}

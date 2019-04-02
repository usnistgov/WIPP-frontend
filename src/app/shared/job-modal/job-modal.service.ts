import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Job} from './job';
import {environment} from '../../../environments/environment';

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

  getJob(jobId: string): Observable<Job> {
    return this.http.get<Job>(`${this.jobsUrl}/${jobId}`, httpOptions);
  }
}

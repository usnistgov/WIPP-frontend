import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Job} from '../job/job';
import {PaginatedPyramid, Pyramid} from './pyramid';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'}),
  params: {}
};

@Injectable({
  providedIn: 'root'
})
export class PyramidService {
  private pyramidsUrl = environment.apiRootUrl + '/pyramids';

  constructor(
    private http: HttpClient) {
  }

  getPyramid(id: string): Observable<Pyramid> {
    return this.http.get<Pyramid>(`${this.pyramidsUrl}/${id}`);
  }

  getPyramids(params): Observable<PaginatedPyramid> {
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
    return this.http.get<any>(this.pyramidsUrl, httpOptions).pipe(
      map((result: any) => {
        result.pyramids = result._embedded.pyramids;
        return result;
      }));
  }

  getPyramidsByNameContainingIgnoreCase(params, name): Observable<PaginatedPyramid> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: {}
    };

    let httpParams = new HttpParams().set('name', name);
    if (params) {
      const page = params.pageIndex ? params.pageIndex : null;
      const size = params.size ? params.size : null;
      const sort = params.sort ? params.sort : null;
      httpParams = httpParams.set('name', name).set('page', page).set('size', size).set('sort', sort);
      httpOptions.params = httpParams;
    }
    console.log('httpOptions');
    return this.http.get<any>(this.pyramidsUrl + '/search/findByNameContainingIgnoreCase', httpOptions).pipe(
      map((result: any) => {
        result.pyramids = result._embedded.pyramids;
        return result;
      }));
  }

  getJob(jobUrl: string): Observable<Job> {
    return this.http.get<Job>(jobUrl);
  }

}

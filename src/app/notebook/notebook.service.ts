import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Notebook, PaginatedNotebooks} from './notebook';
import {map} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class NotebookService {

  private notebooksUrl = environment.apiRootUrl + '/notebooks';

  constructor(
    private http: HttpClient) {
  }

  getNotebook(id: string): Observable<Notebook> {
    return this.http.get<Notebook>(`${this.notebooksUrl}/${id}`);
  }

  getNotebookFile(id: string): Observable<string> {
    return this.http.get<string>(`${this.notebooksUrl}/${id}/getFile`);
  }

  getNotebooks(params): Observable<PaginatedNotebooks> {
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
    return this.http.get<any>(this.notebooksUrl, httpOptions).pipe(
      map((result: any) => {
        result.notebooks = result._embedded.notebooks;
        return result;
      }));
  }

  getNotebooksByNameContainingIgnoreCase(params, name): Observable<PaginatedNotebooks> {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
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
    return this.http.get<any>(this.notebooksUrl + '/search/findByNameContainingIgnoreCase', httpOptions).pipe(
      map((result: any) => {
        result.notebooks = result._embedded.notebooks;
        return result;
      }));
  }
}

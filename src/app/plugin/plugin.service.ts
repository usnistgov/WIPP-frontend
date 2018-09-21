import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {PaginatedPlugins, Plugin} from './plugin';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {HttpParams} from '../../../node_modules/@angular/common/http';
import {map} from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  params: {}
};

@Injectable({providedIn: 'root'})
export class PluginService {
  constructor(
    private http: HttpClient
  ) {}

  private pluginsUrl = environment.apiRootUrl + '/plugins';

  getPlugins(params): Observable<PaginatedPlugins> {
    if (params) {
      const page = params.pageIndex ? params.pageIndex : null;
      const size = params.size ? params.size : null;
      const httpParams = new HttpParams().set('page', page).set('size', size);
      httpOptions.params = httpParams;
    }
    return this.http.get<any>(this.pluginsUrl, httpOptions).pipe(
      map((result: any) => {
        result.plugins = result._embedded.plugins;
        return result;
      }));
  }

  postPlugin(pluginDescriptor): Observable<Plugin> {
    return this.http.post<Plugin>(this.pluginsUrl,
      pluginDescriptor,
      httpOptions
    );
  }
}

import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {PaginatedPlugins, Plugin} from './plugin';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';
import {PaginatedStitchingVector} from '../stitching-vector/stitching-vector';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'}),
  params: {}
};

@Injectable({providedIn: 'root'})
export class PluginService {
  constructor(
    private http: HttpClient
  ) {
  }

  private pluginsUrl = environment.apiRootUrl + '/plugins';
  private pluginList: Plugin[];
  private categoryList: string[] = [];

  getPlugins(params): Observable<PaginatedPlugins> {
    if (params) {
      const page = params.pageIndex ? params.pageIndex : null;
      const size = params.size ? params.size : null;
      const sort = params.sort ? params.sort : null;
      const httpParams = new HttpParams().set('page', page).set('size', size).set('sort', sort);
      httpOptions.params = httpParams;
    }
    return this.http.get<any>(this.pluginsUrl, httpOptions).pipe(
      map((result: any) => {
        result.plugins = result._embedded.plugins;
        this.pluginList = result.plugins;
        return result;
      }));
  }

  getPluginsByNameContainingIgnoreCase(params, name): Observable<PaginatedPlugins> {
    let httpParams = new HttpParams().set('name', name);
    if (params) {
      const page = params.pageIndex ? params.pageIndex : null;
      const size = params.size ? params.size : null;
      const sort = params.sort ? params.sort : null;
      httpParams = httpParams.set('page', page).set('size', size).set('sort', sort);
    }
    httpOptions.params = httpParams;
    return this.http.get<any>(this.pluginsUrl + '/search/findByNameContainingIgnoreCase', httpOptions).pipe(
      map((result: any) => {
        result.plugins = result._embedded.plugins;
        return result;
      }));
  }

  getAllPluginsOrderedByName(): Observable<PaginatedPlugins> {
    const httpParams = new HttpParams();
    httpOptions.params = httpParams;
    return this.http.get<any>(this.pluginsUrl + '/search/findByOrderByNameAsc', httpOptions).pipe(
      map((result: any) => {
        result.plugins = result._embedded.plugins;
        return result;
      }));
  }

  postPlugin(pluginDescriptor): Observable<Plugin> {
    const httpParams = new HttpParams();
    httpOptions.params = httpParams;
    return this.http.post<Plugin>(this.pluginsUrl,
      pluginDescriptor,
      httpOptions
    );
  }

  getPlugin(id): Observable<Plugin> {
    return this.http.get<Plugin>(`${this.pluginsUrl}/${id}`);
  }

  getPluginInputType(plugin: Plugin, inputName: string): string {
    for (const pluginInput of plugin.inputs) {
      if (pluginInput['name'] = inputName) {
        return (pluginInput['type']);
      }
    }
  }

  getPluginInputKeys(plugin: Plugin): string[] {
    const inputKeys: string[] = [];
    for (const pluginInput of plugin.inputs) {
      inputKeys.push(pluginInput['name']);
    }
    return (inputKeys);
  }

    getPluginOutputKeys(plugin: Plugin): string[] {
    const outputKeys: string[] = [];
    for (const pluginInput of plugin.outputs) {
      outputKeys.push(pluginInput['name']);
    }
    return (outputKeys);
  }

  getJsonFromURL(url: string): Observable<JSON> {
    return this.http.get<JSON>(url);
  }

  //Test
  getAllCategories(): string[] {
    this.pluginList.forEach((p) => this.categoryList.push(p.category));
    this.categoryList = this.categoryList.filter((n,i) => this.categoryList.indexOf(n)===i && n!=null);
    return this.categoryList;
  }

  getAllInstitutions(): string[] {
    const httpParams = new HttpParams();
    httpOptions.params = httpParams;
    let institutions: string[] = [];
    this.http.get<string[]>(this.pluginsUrl + '/search/getAllInstitutions', httpOptions).subscribe(
      (inst) => {
        institutions = inst.slice();
      }
    );
    return institutions;
  }
  //Test getPlugings by criteria
  getPluginsByCriteria(params, name, category, institution): Observable<PaginatedPlugins> {
    let httpParams = new HttpParams().set('name', name).set('category', category).set('institution', institution);
    if (params) {
      const page = params.pageIndex ? params.pageIndex : null;
      const size = params.size ? params.size : null;
      const sort = params.sort ? params.sort : null;
      httpParams = httpParams.set('page', page).set('size', size).set('sort', sort);
    }
    httpOptions.params = httpParams;
    
    if(category === 'all' && institution === 'all')
      return this.getPlugins(params);

    if(category === 'all' && institution !== 'all')
      return this.http.get<any>(this.pluginsUrl + '/search/findByNameContainingIgnoreCaseAndInstitution', httpOptions).pipe(
        map((result: any) => {
          result.plugins = result._embedded.plugins;
          return result;
        }));

    if(category !== 'all' && institution === 'all')
      return this.http.get<any>(this.pluginsUrl + '/search/findByNameContainingIgnoreCaseAndCategory', httpOptions).pipe(
        map((result: any) => {
          result.plugins = result._embedded.plugins;
          return result;
        }));  

    return this.http.get<any>(this.pluginsUrl + '/search/findByNameContainingIgnoreCaseAndCategoryAndInstitution', httpOptions).pipe(
      map((result: any) => {
        result.plugins = result._embedded.plugins;
        return result;
      }));
  }
}

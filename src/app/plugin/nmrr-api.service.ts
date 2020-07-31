import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {PluginsNmrr} from './pluginsNmrr';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';


const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'}),
  params: {}
};

@Injectable({
  providedIn: 'root'
})
export class NmrrApiService {

  constructor(private http: HttpClient) { }

  // get plugins from nmrr registry using it's api
  getPluginsFromNmrr(params?): Observable<PluginsNmrr> {
    if (params) {
      if (params.page) {
        const httpParams = new HttpParams().set('page', params.page);
        httpOptions.params = httpParams;
      }
    }
    const transferObject = {'query': {'$or': [{'Resource.role.type': 'Plugin'}, {'Resource.role.type.#text': 'Plugin'}]}} ;
    const jsonObject = JSON.stringify(transferObject);
    return this.http.post<any>(environment.registryAPI + '/query/', jsonObject, httpOptions);
  }

  // get plugins whose the name contains a pattern
  getPluginsFromNmrrByName(params?): Observable<PluginsNmrr> {
    if (params) {
      if (params.page) {
        const httpParams = new HttpParams().set('page', params.page);
        httpOptions.params = httpParams;
      }
    }
    const transferObject = {'query': { '$and': [{'$or':
            [{'Resource.role.type': 'Plugin'}, {'Resource.role.type.#text': 'Plugin'}]},
          {'$or': [{'Resource.identity.title': { '$regex': '.*' + params.name + '.*', '$options' : 'i' }},
              {'Resource.identity.title.#text': { '$regex': '.*' + params.name + '.*', '$options' : 'i' }}]}
              ]
    }};
    const jsonObject = JSON.stringify(transferObject);
    return this.http.post<any>(environment.registryAPI + '/query/', jsonObject, httpOptions);
  }

}

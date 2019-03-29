import {Injectable} from '@angular/core';
import {PaginatedStitchingVector, StitchingVector} from './stitching-vector';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {PaginatedImagesCollections} from '../images-collection/images-collection';

@Injectable({
  providedIn: 'root'
})
export class StitchingVectorService {
  private stitchingVectorsUrl = environment.apiRootUrl + '/stitchingVectors';

  constructor(
    private http: HttpClient
  ) {
  }

  uploadFile(stitchingVector: StitchingVector) {
    const formData = new FormData();
    formData.append('file', stitchingVector.file, stitchingVector.file.name);
    formData.append('name', stitchingVector.name);
    stitchingVector.note ? formData.append('message', stitchingVector.note) : formData.append('message', '');

    this.http.post<StitchingVector>(this.stitchingVectorsUrl + '/upload', formData)
      .subscribe(res => {
        console.log(res);
      });
  }

  getStitchingVectorsUrl(stitchingVector: StitchingVector): string {
    return `${this.stitchingVectorsUrl}/${stitchingVector.id}/vector`; // TODO: check path
  }

  getStitchingVector() {
    return this.http.get(this.stitchingVectorsUrl);
  }

  getStitchingVectors(params): Observable<PaginatedStitchingVector> {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      params: {}
    };
    if (params) {
      const page = params.pageIndex ? params.pageIndex : null;
      const size = params.size ? params.size : null;
      const httpParams = new HttpParams().set('page', page).set('size', size);
      httpOptions.params = httpParams;
    }
    return this.http.get<any>(this.stitchingVectorsUrl, httpOptions).pipe(
      map((result: any) => {
        console.log(result);
        result.stitchingVectors = result._embedded.stitchingVectors;
        return result;
      }));
  }
}

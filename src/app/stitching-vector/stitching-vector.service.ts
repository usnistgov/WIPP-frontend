import {Injectable} from '@angular/core';
import {StitchingVector} from './stitching-vector';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';

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

    this.http.post<StitchingVector>(this.stitchingVectorsUrl + '/upload', formData);
  }

  getVectorsUrl(stitchingVector: StitchingVector): string {
    return `${this.stitchingVectorsUrl}/${stitchingVector.id}/vector`; // TODO: check path
  }
}

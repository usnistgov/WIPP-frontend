import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { AiModelCard } from '../ai-model-card/ai-model-card';

@Injectable({
  providedIn: 'root'
})
export class AiModelCardService {

  private AiModelCardUrl = environment.apiRootUrl + '/aiModelCards';

  constructor(private http: HttpClient) { }

  /***** GET *****/

  getAiModelCard(aiModelId: string): Observable<AiModelCard> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: new HttpParams().set('aiModelId', aiModelId)
    };
    return this.http.get<AiModelCard>(`${this.AiModelCardUrl}/search/findModelCardByAiModelId`, httpOptions);
  }

  exportTensorflow(id: string): Observable<HttpResponse<Blob>> {
    return this.http.get(`${this.AiModelCardUrl}/${id}/export/tensorflow`, { observe: 'response', responseType: 'blob' });
  }

  exportHuggingface(id: string): Observable<HttpResponse<Blob>> {
    return this.http.get(`${this.AiModelCardUrl}/${id}/export/huggingface`, { observe: 'response', responseType: 'blob' });
  }

  exportBioimageio(id: string): Observable<HttpResponse<Blob>> {
    return this.http.get(`${this.AiModelCardUrl}/${id}/export/bioimageio`, { observe: 'response', responseType: 'blob' });
  }

  exportCDCS(id: string): Observable<HttpResponse<Blob>> {
    return this.http.get(`${this.AiModelCardUrl}/${id}/export/cdcs`, { observe: 'response', responseType: 'blob' });
  }

  /***** PATCH *****/

  updateAiModelCard(aiModelCard: AiModelCard): Observable<AiModelCard> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: {}
    };
    return this.http.patch<AiModelCard>(`${this.AiModelCardUrl}/${aiModelCard['id']}`, aiModelCard, httpOptions);
  }

  /***** POST *****/

  postAiModelCard(aiModelCard: AiModelCard): Observable<AiModelCard> {
    return this.http.post<AiModelCard>(this.AiModelCardUrl, aiModelCard);
  }
  
  /***** DELETE *****/

  deleteAiModelCard(aiModelCard: AiModelCard) {
    return this.http.delete<AiModelCard>(`${this.AiModelCardUrl}/${aiModelCard['id']}`);
  }

}

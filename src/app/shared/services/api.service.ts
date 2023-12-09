import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  getFormattedUrl(route: string): string {
    let url = environment?.baseUrl + route;
    return url;
  }

  httpGet(route: string, params: any = {}): Observable<any> {
    const headers = this.buildHeaders();
    return this.http.get(this.getFormattedUrl(route), {
      headers: headers,
      params: params,
    });
  }

  httpPost(route: string, payload: any) {
    const headers = this.buildHeaders();
    return this.http.post(this.getFormattedUrl(route), payload, {
      headers: headers,
    });
  }

  httpPut(route: string, payload: any) {
    const headers = this.buildHeaders();
    return this.http.put(this.getFormattedUrl(route), payload, {
      headers: headers,
    });
  }

  httpDelete(route: string) {
    const headers = this.buildHeaders();
    return this.http.delete(this.getFormattedUrl(route), { headers: headers });
  }

  private buildHeaders(): HttpHeaders {
    const defaultHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const token = localStorage.getItem('token');
    const headers = this.setTokenInHeaders(defaultHeaders, token);
    return headers;
  }

  private setTokenInHeaders(
    headers: HttpHeaders,
    token: string | null
  ): HttpHeaders {
    return token ? headers.append('Authorization', `Bearer ${token}`) : headers;
  }
}

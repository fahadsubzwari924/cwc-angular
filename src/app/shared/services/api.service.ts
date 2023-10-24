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

  httpOptions: any = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  getFormattedUrl(route: string): string {
    let url = environment?.baseUrl + route;
    return url;
  }

  httpGet(route: string, headers = this.httpOptions): Observable<any> {
    return this.http.get(this.getFormattedUrl(route), this.httpOptions);
  }

  httpPost(
    route: string,
    payload: any,
    headers: HttpHeaders = this.httpOptions
  ) {
    return this.http.post(this.getFormattedUrl(route), payload);
  }

  httpPut(route: string, payload: any, headers: HttpHeaders) {
    return this.http.put(this.getFormattedUrl(route), payload, {
      headers: headers,
    });
  }

  httpDelete(route: string) {
    return this.http.delete(this.getFormattedUrl(route));
  }
}

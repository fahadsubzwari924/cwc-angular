import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiPaths } from 'src/app/shared/enums/api-paths';
import { ApiService } from 'src/app/shared/services/api.service';
import { LoginResponse } from '../models/login-response.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private apiService: ApiService) {}

  signIn(loginPayload: {
    email: string;
    password: string;
  }): Observable<LoginResponse> {
    return this.apiService
      .httpPost(`${ApiPaths.Auth}/login`, loginPayload)
      .pipe(map((response: any) => new LoginResponse(response.payload)));
  }
}

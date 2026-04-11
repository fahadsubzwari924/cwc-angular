import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiPaths } from 'src/app/shared/enums/api-paths';
import { ApiService } from 'src/app/shared/services/api.service';
import { LoginResponse } from '../models/login-response.model';
import { User } from '../models/user.model';

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiService = inject(ApiService);

  /**
   * Persists token and user to localStorage so the app and AuthGuard can use them.
   * Call this after a successful login response.
   */
  setSession(loginResponse: LoginResponse): void {
    if (loginResponse.accessToken) {
      localStorage.setItem(TOKEN_KEY, loginResponse.accessToken);
    }
    if (loginResponse.user) {
      const userJson = JSON.stringify(loginResponse.user);
      localStorage.setItem(USER_KEY, userJson);
    }
  }

  getStoredToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  getStoredUser(): User | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  }

  clearSession(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  signIn(loginPayload: {
    email: string;
    password: string;
  }): Observable<LoginResponse> {
    return this.apiService
      .httpPost(`${ApiPaths.Auth}/login`, loginPayload)
      .pipe(
        map((response: any) => {
          const data = response?.payload ?? response?.data ?? response;
          return new LoginResponse(data);
        })
      );
  }
}

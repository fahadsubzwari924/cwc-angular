import { inject, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  canActivate(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ): boolean | UrlTree {
    const hasToken = !!this.authService.getStoredToken();
    if (hasToken) {
      return true;
    }
    return this.router.createUrlTree(['/login']);
  }
}

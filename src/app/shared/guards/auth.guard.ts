import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Route, UrlSegment, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of, delay, switchMap } from 'rxjs';
import { AuthService } from "../../services/auth/auth.service";
import { UserAccessService } from "../../services/user-access/user-access.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {
  constructor(
    private authService: AuthService,
    private router: Router,
    private accessService: UserAccessService
  ) {}

  // ✅ используется при навигации (если уже загружено)
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    if (!this.authService.isAuthenticated) {
      this.router.navigate(['/auth']);
      return of(false);
    }

    return this.accessService.getUserRules().pipe(
      delay(200),
      switchMap((roles) => {
        if (Array.isArray(roles) && roles.length > 0) {
          this.accessService.initAccess(roles);
          return of(true);
        } else {
          return of(false);
        }
      })
    );
  }

  // ✅ используется до загрузки ленивого модуля
  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> {
    if (!this.authService.isAuthenticated) {
      this.router.navigate(['/auth']);
      return of(false);
    }

    return this.accessService.getUserRules().pipe(
      delay(200),
      switchMap((roles) => {
        if (Array.isArray(roles) && roles.length > 0) {
          this.accessService.initAccess(roles);
          return of(true);
        } else {
          return of(false);
        }
      })
    );
  }
}


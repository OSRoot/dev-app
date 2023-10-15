import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, filter, map, take } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    return this.auth.isAuthenticated.pipe(
      filter((BH_VALUE) => BH_VALUE !== null),
      take(1),
      map((isAuthenticated) => {
        console.log('Map in CanLLoad: ', isAuthenticated);

        if (isAuthenticated) {
          return true;
        } else {
          console.log(isAuthenticated);
          this.router.navigateByUrl('/login', { replaceUrl: true });
          return false;
        }
      })
    );
  }
}

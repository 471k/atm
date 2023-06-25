import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate{

  constructor(
    private router: Router,
    private auth: AuthService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>
  {
    return this.auth.user$?.pipe(
      map((user: any) =>{
        if(user) return true;
        
        // this.router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
        this.router.navigate(['/login']);
        return false;
      })
    );
  }
}

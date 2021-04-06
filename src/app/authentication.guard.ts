import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthguardService } from './_services/authguard.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {
  constructor(private Authguardservice: AuthguardService, private router: Router) { }
  canActivate(): boolean {
    if (!this.Authguardservice.getToken()) {
      this.router.navigateByUrl("/login");
    }
    return this.Authguardservice.getToken();
  }

}

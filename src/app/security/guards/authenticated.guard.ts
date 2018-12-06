import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable({
	providedIn: 'root'
})
export class AuthenticatedGuard implements CanActivate {

	constructor(private af: AngularFireAuth, private router: Router) {

	}

	canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

		return this.af.authState.pipe(map(x => { 
			if (x!=null){
				return true;
			}else{
				this.router.navigate(['/login']);
				return false;
			}
		} ));
		
	}
}

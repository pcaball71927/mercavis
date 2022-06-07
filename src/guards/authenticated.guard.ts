import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AuthenticationService } from '../providers/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticatedGuard implements CanActivate {
	
	constructor(
		private navCtrl: NavController,
		private authService: AuthenticationService
	) { }

	canActivate() {
		return this.authService.isLogin().then((login)=>{
			if(login)
				return true;

			this.navCtrl.navigateRoot(['/login']);
			return false;
		}).catch((err)=>{
			this.navCtrl.navigateRoot(['/login']);
			return false;
		});
	} 
}

import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Http } from '@capacitor-community/http';
import { AppComponent } from '../app/app.component';
import { AuthenticationService } from './authentication.service';
import { map } from 'rxjs/operators';

/* libraries */
import { Toast } from '@capacitor/toast';

@Injectable({
  providedIn: 'root'
})
export class MainService {

    private keys = ['password', 'device'];

	constructor(
        private authService: AuthenticationService,
        private navCtrl: NavController
    ) {
		console.log('Hello MainServiceProvider Provider');
	}

    async get(request: string, data: any){
        let params='';
        for(let key in data){
            params+='&'+encodeURIComponent(String(key))+'='+encodeURIComponent(String(data[key]));
        }
        
        let access_token = await this.authService.getAuthToken();  
        if(access_token)
            params = 'access_token='+access_token+params;

        try{
            let http_request = await Http.get({
                url: AppComponent.API_ENDPOINT+request+'?'+params
            });

            if(http_request.status >= 200 || http_request.status < 300 )
                return http_request.data; 

            throw new Error(http_request.data);
        }catch (error){
            return this.handleError(error);
        }     
    }

    async post(request: string, data: any, toLower: boolean = true){
        let access_token = await this.authService.getAuthToken();

        if(toLower)
            for(let key in data)
                if(this.keys.indexOf(key.toLowerCase().trim()) < 0)
                    data[key] = typeof data[key] == 'string' ? data[key].toLowerCase().trim() : data[key];
        
        try{
            let http_request = await Http.post({
                url: AppComponent.API_ENDPOINT+request+( access_token ? '?access_token='+access_token : ''),
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            });

            if(http_request.status >= 200 || http_request.status < 300 )
                return http_request.data; 

            throw new Error(http_request.data);
        }catch (error){
            return this.handleError(error);
        }
    }

    async showToast(msg) {
        await Toast.show({'text': msg, 'duration': 'long', 'position': 'center'});
    }

    private handleError(error){
        if(error.status == 401){
            this.authService.logout('Tu Sesión ha expirado.');
            this.showToast('Su sesión ha expirado, por inicie sesión de nuevo.');
            this.navCtrl.navigateRoot(['/login']);
            return null;
        }
        return error._body;
    }
}

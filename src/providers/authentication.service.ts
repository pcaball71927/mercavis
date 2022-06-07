import { Inject, Injectable } from '@angular/core';
import { Http } from '@capacitor-community/http';
import { AppComponent } from '../app/app.component';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

    private storageObserver;

	constructor(
        private storage: StorageService
    ) {
        console.log('Hello AuthServiceProvider Provider');
        this.storageObserver = new BehaviorSubject(null);
    }

    async login(user: string, password: string) {
        console.log("intento iniciar sesion");
        let request = await Http.post({
            url: AppComponent.API_ENDPOINT+'/clients/login',
            data: { 
                "email":user.toLowerCase().trim(), 
                "password":password 
            },
            headers: {
                'Content-Type': 'application/json'
            }
        });
        let response = request.data;
        
        if (request.status === 200) {
            await this.storage.set('auth_token', response.id);
            await this.storage.set('id_user', response.userId);
        } else {
            throw new Error('Invalid login.');
        }

        let user_request = await Http.get({
            url: AppComponent.API_ENDPOINT+'/clients/'+response.userId+'?access_token='+response.id
        });
        let user_object = user_request.data

        if(user_request.status === 200){
            await this.storage.set('user', JSON.stringify(user_object));
            this.storageObserver.next(null);
        } else {
            throw new Error('Invalid fetch user.');
        }

        return user_object;
    }

    async isLogin(){
        let login = await this.storage.get('id_user');
        return login ? true : false;
    }

    getAuthToken(){
        return this.storage.get('auth_token')
    }

    getIdUser(){
        return this.storage.get('id_user');
    }

    async getUser(){
        let user = await this.storage.get('user');
        return user ? JSON.parse(user) : null;
    }

    async setUser(user){
        await this.storage.set('user', JSON.stringify(user));
        this.storageObserver.next(null);
    }

    async logout(msg=undefined, event=true){
        let user = await this.getUser();

        await this.storage.remove('user');
        await this.storage.remove('auth_token');
        await this.storage.remove('id_user');
        this.storageObserver.next(null);
    }

    watcher():BehaviorSubject<any>{
        return this.storageObserver;
    }
}

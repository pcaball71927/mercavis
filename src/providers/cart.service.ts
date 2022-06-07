import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { StorageService } from './storage.service';

@Injectable()

@Injectable({
  providedIn: 'root'
})
export class CartService {

    private storageObserver;

	constructor(
        private storage: StorageService
    ) {
        console.log('Hello CartProvider Provider');
        this.storageObserver = new BehaviorSubject(null);
    }

    async getCartItems(){
        let cart_items = await this.storage.get('cart_items');
        return cart_items ? JSON.parse(cart_items) : null;
    }

    async setCartItems(cart_items){
        await this.storage.set('cart_items', JSON.stringify(cart_items));
        this.storageObserver.next(null);
    }

    watcher():BehaviorSubject<any>{
        return this.storageObserver;
    }

    async clearCart(){
        await this.storage.remove('cart_items');
        this.storageObserver.next(null);
    }
}

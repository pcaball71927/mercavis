import { Component, OnInit } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { NavController } from '@ionic/angular';

/* providers */
import { MainService } from '../../providers/main.service';
import { CartService } from '../../providers/cart.service';

/* plugins */
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { Toast } from '@capacitor/toast';
import { TextToSpeech } from '@capacitor-community/text-to-speech';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.page.html',
  styleUrls: ['./shopping-cart.page.scss'],
})
export class ShoppingCartPage implements OnInit {

  cart_items = [];
  total = 0;

  constructor(
    private androidPermissions: AndroidPermissions,
    private barcodeScanner: BarcodeScanner,
    private mainService: MainService,
    private cartService: CartService,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.cartService.watcher().subscribe(() => {
      this.loadData();
    });
  }

  async loadData(){
    this.cart_items = await this.cartService.getCartItems();
    this.total = 0;
    this.cart_items.forEach(x => {
      this.total += x.price * x.cant;
    });
  }
  async showToast(msg) {
    await Toast.show({'text': msg, 'duration': 'long', 'position': 'center'});
  }

  requestPermissions(){
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA).then(
      result => console.log('Has permission?',result.hasPermission),
      err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA)
    );
  }

  openScanner(){
    this.requestPermissions();
    this.barcodeScanner.scan().then(barcodeData => {
      if(barcodeData && barcodeData.text)
        this.findProduct(barcodeData.text);
      else
        this.showToast('Error en la lectura del código QR.');
    }).catch(err => {
      this.showToast('Error en la lectura del código QR.');
    });      
  }

  async findProduct(sku){
    let filter = null;
    filter = {
      "filter": `{"limit": 1,"where":{"sku":"${sku}"}}`
    };
    
    let products = await this.mainService.get('/products', filter);
    if(products.length==1){
      let navigationExtras: NavigationExtras = {
        state: {
          product: products[0]
        } 
      };
      this.navCtrl.navigateForward('product-description', navigationExtras);
    } else
      this.showToast("No existe un producto asociada a ese código de barras.");
  }

  async clearCart(){
    let text = 'El total de la compra es ' + this.total;
    await this.speak(text);
    await this.cartService.clearCart();
  }

  async speak(text) {
    await TextToSpeech.speak({
      text: text,
      lang: 'es-ES',
      rate: 0.7,
      pitch: 1.0,
      volume: 1.0,
      category: 'ambient',
    });
  };
}

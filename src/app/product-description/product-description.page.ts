import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';

/* providers */
import { CartService } from '../../providers/cart.service';

/* plugins */
import { TextToSpeech } from '@capacitor-community/text-to-speech';

@Component({
  selector: 'app-product-description',
  templateUrl: './product-description.page.html',
  styleUrls: ['./product-description.page.scss'],
})
export class ProductDescriptionPage implements OnInit {

  product;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cartService: CartService,
    private navCtrl: NavController
  ) {
    this.route.queryParams.subscribe((params) => {  
      let navParams = this.router.getCurrentNavigation().extras.state;
      this.product = navParams.product;
    });
  }

  ngOnInit() {
    let text = this.product.name + " " + this.product.description + " " + this.product.allergens + " " + this.product.price + " pesos Colombianos";
    this.speak(text);
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

  async stop() {
    await TextToSpeech.stop();
  };

  async addProduct(){
    let cart_items = await this.cartService.getCartItems();
    if(!cart_items)
      cart_items = [];
    let product = cart_items.find( x => x.sku == this.product.sku);
    if(product){
      product.cant += 1;
    } else {
      this.product.cant = 1;
      cart_items.push(this.product);
    }
    await this.cartService.setCartItems(cart_items);
    this.stop();
    this.navCtrl.pop();
  }

  async deleteProduct(){
    this.stop();
    this.navCtrl.pop();
  }

}

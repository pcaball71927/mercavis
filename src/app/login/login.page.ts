import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, LoadingController } from '@ionic/angular';

/*libraries*/
import { Toast } from '@capacitor/toast';

/* providers */
import { MainService } from '../../providers/main.service';
import { AuthenticationService } from '../../providers/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public email;
  public password;
  public process;
  public msg;
  public msg_string;

  constructor(
    private navCtrl: NavController,
    private authService: AuthenticationService,
    private mainService: MainService
    ) {
    this.msg=false;
  }

  ngOnInit() {}

  async showToast(msg) {
    await Toast.show({'text': msg, 'duration': 'long', 'position': 'center'});
  }

  login(){
    if(this.email && this.password){
      this.email = this.email.toLowerCase().trim();
      this.process=true;
      this.authService.login(this.email, this.password)
      .then((res)=>{
        if(res){
          this.navCtrl.navigateRoot(['/shopping-cart']);
          this.showToast('Has iniciado sesión.');
        }
        this.process=false;
      }).catch((error)=>{
        this.msg=true;
        this.process=false;
        this.msg_string="Email o password invalido.";
      });
    }
  }
}
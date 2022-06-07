import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

/* plugins */
import { Toast } from '@capacitor/toast';

/* providers */
import { MainService } from '../../providers/main.service';
import { AuthenticationService } from '../../providers/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  registerForm;
  error;
  countries;
  invalid_form;

  constructor(
    private fb: FormBuilder,
    private navCtrl: NavController,
    private authService: AuthenticationService,
    private mainService: MainService
    ) {
    this.registerForm = this.fb.group({
      full_name:  [null, [Validators.required]],
      cedula:  [null, [Validators.required]],
      address:  [null, [Validators.required]],
      email:  [null, [Validators.required, Validators.email]],
      password:  [null, [Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/)]]
    });
    this.invalid_form = false;
  }

  ngOnInit() { }

  async showToast(msg) {
    await Toast.show({'text': msg, 'duration': 'long', 'position': 'center'});
  }

  get f() { return this.registerForm.controls; }

  async onSubmit(){
    if(this.registerForm.invalid){
      this.invalid_form = true;
      return;
    }

    let profile_values = this.registerForm.value;
   
    for(let key in profile_values)
      if(key.toLowerCase().trim() != 'password' && typeof(profile_values[key]) == 'string')
        profile_values[key] = profile_values[key].toLowerCase().trim();

    let response = null

    try{
      response = await this.mainService.post('/clients', profile_values, false);
    } catch(err) {
      this.error = true;
    }

    if(response){
      this.showToast('Su usuario se ha registrado correctamente.');
      this.navCtrl.pop();
    } else 
      this.error = true;
  }
}

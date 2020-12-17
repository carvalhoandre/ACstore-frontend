import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { CredenciaisDTO } from '../../models/credenciais.dto';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  creds: CredenciaisDTO = {
    email: "",
    senha: ""
  };

  constructor(public navCtrl: NavController) {

  }

  login(){
    console.log(this.creds);
    this.navCtrl.setRoot('CategoriasPage');
  }

}

import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { API_CONFIG } from '../../config/api.config';
import { ClienteDTO } from '../../models/cliente.dto';
import { ClienteService } from '../../services/domain/cliente.service';
import { StorageService } from '../../services/storage.service';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  cliente: ClienteDTO;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public storage: StorageService,
    public clienteService : ClienteService,
    public loadCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    let localUser = this.storage.getLocalUser();
    let loader = this.presentLoading();
    if (localUser && localUser.email){
      loader.dismiss();
      this.clienteService.findByEmail(localUser.email)
        .subscribe(response => {
          this.cliente = response as ClienteDTO;
          this.getImageIfExists();
        },
        error => {
          loader.dismiss();
          if (error.status == 403) {
            this.navCtrl.setRoot('HomePage');
          }
        });
      }
      else{
        loader.dismiss();
        this.navCtrl.setRoot('HomePage');
      }
    }

    getImageIfExists() {
      this.clienteService.getImageFromBucket(this.cliente.id)
      .subscribe(response => {
        this.cliente.imageUrl = `${API_CONFIG.bucketBaseUrl}/cp${this.cliente.id}.jpg`;
      },
      error => {});
    }

    presentLoading(){
      let loader = this.loadCtrl.create({
        content: "Aguarde...",
      });
      loader.present();
      return loader;
    }
}

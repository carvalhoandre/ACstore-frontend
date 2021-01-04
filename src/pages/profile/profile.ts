import { Component } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera';
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
  picture: string;
  cameraOn: boolean = false;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public storage: StorageService,
    public clienteService : ClienteService,
    public loadCtrl: LoadingController,
    public camera : Camera) {
  }

  ionViewDidLoad() {
      this.loadData();
    }

    loadData(){
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

    getCameraPicture(){

      this.cameraOn = true;

      const options: CameraOptions = {
        quality: 100,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.PNG,
        mediaType: this.camera.MediaType.PICTURE
      }
      
      this.camera.getPicture(options).then((imageData) => {
       this.picture = 'data:image/png;base64,' + imageData;
       this.cameraOn = false;
      }, (err) => {
      });
    }

    sendPicture() {
      this.clienteService.uploadPicture(this.picture)
        .subscribe(response => {
          this.picture = null;
          this.loadData();
        },
        error => {
        });
    }

    cancel(){
      this.picture = null;
    }
}

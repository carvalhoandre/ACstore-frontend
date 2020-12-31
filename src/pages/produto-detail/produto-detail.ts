import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { API_CONFIG } from '../../config/api.config';
import { ProdutoDTO } from '../../models/produto.dto';
import { CartService } from '../../services/domain/cart.service';
import { ProdutoService } from '../../services/domain/produto.service';

@IonicPage()
@Component({
  selector: 'page-produto-detail',
  templateUrl: 'produto-detail.html',
})
export class ProdutoDetailPage {

  item: ProdutoDTO;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public produtoService: ProdutoService,
    public cartService: CartService,
    public loadCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    let produto_id = this.navParams.get('produto_id');
    let loader = this.presentLoading();
    this.produtoService.findById(produto_id)
      .subscribe(response => {
        loader.dismiss();
        this.item = response;
        this.getImageUrlIfExists();
      },
      error => {
        loader.dismiss();
      });
  }

  getImageUrlIfExists() {
    this.produtoService.getImageFromBucket(this.item.id)
      .subscribe(response => {
        this.item.imageUrl = `${API_CONFIG.bucketBaseUrl}/prod${this.item.id}.jpg`;
      },
      error => {});
  }

  addToCart(produto: ProdutoDTO){
    this.cartService.addProduto(produto);
    this.navCtrl.setRoot('CartPage');
  }

  presentLoading(){
    let loader = this.loadCtrl.create({
      content: "Aguarde...",
    });
    loader.present();
    return loader;
  }
}

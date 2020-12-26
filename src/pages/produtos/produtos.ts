import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { subscribeOn } from 'rxjs/operator/subscribeOn';
import { ProdutoDTO } from '../../models/produto.dto';
import { ProdutoService } from '../../services/domain/produto.service';

@IonicPage()
@Component({
  selector: 'page-produtos',
  templateUrl: 'produtos.html',
})
export class ProdutosPage {

  items : ProdutoDTO[];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public produtoService : ProdutoService) {
  }

  ionViewDidLoad() {
    let categora_id = this.navParams.get('categoria_id')
    this.produtoService.findByCategoria(categora_id)
      .subscribe(response => {
          this.items = response['content'];
      },
      error => {});
  };
}

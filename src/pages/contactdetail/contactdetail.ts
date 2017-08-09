import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';

import { ApiServiceProvider } from '../../providers/api-service/api-service';

/**
 * Generated class for the ContactdetailPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-contactdetail',
  templateUrl: 'contactdetail.html',
})
export class ContactdetailPage {
public htmlString: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
  public apiService: ApiServiceProvider, public nativeStorage: NativeStorage, private loadingCtrl: LoadingController) {
    this.loadDetail();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContactdetailPage');
  }

  loadDetail(){
    let env = this;
    let loading = env.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    this.apiService.loadContact()
      .then(data => {
        this.htmlString = data;
        loading.dismiss();
      });
  }

}

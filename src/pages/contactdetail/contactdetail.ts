import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { CallNumber } from '@ionic-native/call-number';
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
  public htmlString = [];
  // public htmlData = { HtmlText: '', ContactNumber: '' };
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public apiService: ApiServiceProvider, private callNumber: CallNumber, public nativeStorage: NativeStorage, private loadingCtrl: LoadingController) {
    this.loadDetail();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContactdetailPage');
  }

  loadDetail() {
    let env = this;
    let loading = env.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    env.nativeStorage.getItem('ContactDetail')
      .then(function (data) {
        //env.htmlString = data.contactdetail;
        // data.contactdetail.forEach(element => {
        //   let HtmlTextIndex = element.Description.indexOf("<button");
        //   let sIndex = element.Description.indexOf("('");
        //   let lIndex = element.Description.indexOf("')");
        //   let htmlData = { HtmlText: '', ContactNumber: '' };
        //   htmlData = {
        //     HtmlText: element.Description.substr(0, HtmlTextIndex),
        //     ContactNumber: element.Description.substr(sIndex + 2, lIndex - (sIndex + 2))
        //   }
        //   env.htmlString.push(htmlData);
        // });
        loading.dismiss();
      }, function (error) {
        loading.dismiss();
        console.log(error);
      });
  }

  launchDialer(n: string) {
    this.callNumber.callNumber(n, true)
      .then(() => console.log('Launched dialer!'))
      .catch(() => console.log('Error launching dialer'));
  }

}

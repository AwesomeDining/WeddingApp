import { Component } from '@angular/core';
import { NavController, LoadingController, ToastController } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';

import { Network } from '@ionic-native/network';
import { ApiServiceProvider } from '../../providers/api-service/api-service';

/**
 * Generated class for the UsersPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-users',
  templateUrl: 'users.html',
})
export class UsersPage {
  public people: any;
  public user = { ImageURL: '', Name: '', isAdmin: false, Status: 0, sts: '' };
  constructor(public navCtrl: NavController, public apiService: ApiServiceProvider,
    public nativeStorage: NativeStorage, private loadingCtrl: LoadingController, public network: Network, public toast: ToastController) {
    let env = this;
    // let loading = env.loadingCtrl.create({
    //   content: 'Please wait...'
    // });
    // loading.present()
    // env.nativeStorage.getItem('user')
    //   .then(function (userData) {
    //     env.user.ImageURL = userData.picture;
    //     env.user.Name = userData.name;
    //     env.user.isAdmin = userData.isAdmin;
    //     env.user.Status = userData.Status;
    //     // user is previously logged and we have his data
    //     // we will let him access the app
    //     //env.navCtrl.push(HomePage);        
    //     loading.dismiss();
    //   }, function (error) {
    //     //we don't have the user data so we will ask him to log in
    //     //env.navCtrl.push(LoginPage);
    //     loading.dismiss();
    //   });
    // loading.dismiss();
    env.loadPeople();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UsersPage');
  }

  loadPeople() {
    let env = this;
    let loading = env.loadingCtrl.create({
      content: 'Please wait...'
    });

    if (env.network.type !== 'none') {
      loading.present();
      this.apiService.load("null")
        .then(data => {
          env.people = data;
          env.people.forEach(element => {
            let url = element.UserImageUrl;
            element.ImageUrl = url;
          });
          loading.dismiss();
        }, (err) => {
          loading.dismiss();
        });
    }
    else {
      let toast = this.toast.create({
        message: "Please check the internet connection.",
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
    }
  }
}

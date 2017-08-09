import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';

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
  constructor(public navCtrl: NavController, public apiService: ApiServiceProvider, public nativeStorage: NativeStorage, private loadingCtrl: LoadingController) {
    let env = this;
    env.nativeStorage.getItem('user')
      .then(function (userData) {
        env.user.ImageURL = userData.picture;
        env.user.Name = userData.name;
        env.user.isAdmin = userData.isAdmin;
        env.user.Status = userData.Status;
        // user is previously logged and we have his data
        // we will let him access the app
        //env.navCtrl.push(HomePage);        
      }, function (error) {
        //we don't have the user data so we will ask him to log in
        //env.navCtrl.push(LoginPage);
      });

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
    loading.present();
    this.apiService.load("null")
      .then(data => {
        env.people = data;
        env.people.forEach(element => {
          let url = element.UserImageUrl;
          element.ImageUrl = url;
        });
        loading.dismiss();
      });
  }
}

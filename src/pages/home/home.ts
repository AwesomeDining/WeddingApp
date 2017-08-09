import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';

import { ApiServiceProvider } from '../../providers/api-service/api-service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

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

    if (env.user.Status == 10)
      env.user.sts = "Pending";
    else if (env.user.Status == 30) {
      env.user.sts = "Rejected";
    }
    else {
      env.user.sts = "Approved";
    }
  }
}

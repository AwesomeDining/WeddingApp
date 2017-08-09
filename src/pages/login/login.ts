import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, Loading } from 'ionic-angular';
import { MenuPage } from '../menu/menu';
import { GooglePlus } from '@ionic-native/google-plus';
import { Facebook } from '@ionic-native/facebook';

import { NativeStorage } from '@ionic-native/native-storage';
import { Push, PushToken } from '@ionic/cloud-angular';

import { ApiServiceProvider } from '../../providers/api-service/api-service';



@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  loading: Loading;
  regData = { EmailAddress: '', DeviceId: '', UserToken: '', DeviceName: '', UserName: '', UserImageURL: '' };

  constructor(public navCtrl: NavController, private fb: Facebook, private googlePlus: GooglePlus,
    public nativeStorage: NativeStorage, private alertCtrl: AlertController, private loadingCtrl: LoadingController,
    public apiService: ApiServiceProvider, public push: Push) {
  }

  googleLogin() {
    let env = this;
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    this.googlePlus.login({
      'scopes': '', // optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
      'webClientId': '974429559754-nen0ans5lnm4042b73e1ip66e7knooj5.apps.googleusercontent.com', // optional clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
      'offline': true
    })
      .then(function (user) {
        env.push.register().then((t: PushToken) => {
          return env.push.saveToken(t);
        }).then((t: PushToken) => {
          env.regData = {
            EmailAddress: user.email,
            UserToken: user.userId,
            DeviceId: t.token,
            DeviceName: '',
            UserName: user.displayName,
            UserImageURL: user.imageUrl
          }
          loading.dismiss();
          env.registerUser();
        })
      }, function (error) {
        loading.dismiss();
      });
  }

  // generateToken() {
  //   this.push.register().then((t: PushToken) => {
  //     return this.push.saveToken(t);
  //   }).then((t: PushToken) => {
  //     console.log('Token saved:', t.token);
  //   });

  //   this.push.rx.notification()
  //     .subscribe((msg) => {
  //       console.log('I received awesome push: ' + msg);
  //     });
  // }

  fbLogin() {
    let permissions = new Array<string>();
    let env = this;
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    //the permissions your facebook app needs from the user
    permissions = ["public_profile", 'user_friends', 'email'];
    this.fb.login(permissions)
      .then(function (response) {
        let userId = response.authResponse.userID;
        let params = new Array<string>();

        //Getting name and gender properties
        env.fb.api("/me?fields=name,gender,email", params)
          .then(function (user) {
            env.push.register().then((t: PushToken) => {
              return env.push.saveToken(t);
            }).then((t: PushToken) => {
              env.regData = {
                EmailAddress: user.email,
                UserToken: user.id,
                DeviceId: t.token,
                DeviceName: '',
                UserName: user.name,
                UserImageURL: "https://graph.facebook.com/" + userId + "/picture?type=large"
              }
              loading.dismiss();
              env.registerUser();
            });
          })
      }, function (error) {
        loading.dismiss();
        console.log(error);
      });
  }

  registerUser() {
    let env = this;
    let loading = env.loadingCtrl.create({
      content: 'Please wait...'
    });
    env.apiService.register(env.regData).then(function () {
      env.apiService.load(env.regData.UserToken).then(result => {
        let userData = result[0];
        env.nativeStorage.setItem('user',
          {
            name: userData.UserName,
            picture: userData.UserImageUrl,
            isAdmin: userData.IsAdmin,
            Status: userData.Status
          }).then(function () {
            loading.present();
            env.navCtrl.setRoot(MenuPage);
            loading.dismiss();
          }, function (error) {
            loading.dismiss();
            console.log(error);
          });
      }, (err) => {
        console.log(err);
        loading.dismiss();
      });
    });
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...',
      dismissOnPageChange: true
    });
    this.loading.present();
  }

  showError(text) {
    let alert = this.alertCtrl.create({
      title: 'Fail',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present(prompt);
  }

}
import { Component } from '@angular/core';
import { NavController, LoadingController, Loading, ToastController, NavParams } from 'ionic-angular';
import { MenuPage } from '../menu/menu';
import { GooglePlus } from '@ionic-native/google-plus';
import { Facebook } from '@ionic-native/facebook';
import { Network } from '@ionic-native/network';
// import { FCM } from '@ionic-native/fcm';

import { NativeStorage } from '@ionic-native/native-storage';
//import { Push, PushToken } from '@ionic/cloud-angular';
// import { Push, PushObject, PushOptions } from '@ionic-native/push';

//import firebase from 'firebase';

import { ApiServiceProvider } from '../../providers/api-service/api-service';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  loading: Loading;
  isConnected: any;
  token: any;
  regData = { EmailAddress: '', DeviceId: '', UserToken: '', DeviceName: '', UserName: '', UserImageURL: '' };

  constructor(public navCtrl: NavController, private fb: Facebook, private googlePlus: GooglePlus,
    public nativeStorage: NativeStorage, private loadingCtrl: LoadingController, public network: Network,
    public apiService: ApiServiceProvider, public toast: ToastController, public navParams: NavParams) {
    let env = this;


    env.token = navParams.get('Token');
    console.log("LoginToken =>" + env.token);
    // env.nativeStorage.getItem('deviceToken').then(function (deviceToken) {
    //   console.log(deviceToken);
    //   env.token = deviceToken.token;
    // }, err => {
    //   console.log(err);
    // });
    // let loading = this.loadingCtrl.create({
    //   content: 'Please wait...'
    // });
    // const options: PushOptions = {
    //   android: {
    //     senderID: '885563698719',
    //     sound: 'true'
    //   },
    //   ios: {
    //     alert: 'true',
    //     badge: true,
    //     sound: 'true'
    //   },
    //   windows: {},
    //   browser: {
    //     pushServiceURL: 'http://push.api.phonegap.com/v1/push'
    //   }
    // };

    // if (env.network.type !== 'none') {
    //   loading.present();
    //   const pushObject: PushObject = this.push.init(options);
    //   pushObject.on('registration').subscribe((registration: any) => {
    //     env.token = registration.registrationId
    //     loading.dismiss();
    //   });
    // }
    // else {
    //   let toast = this.toast.create({
    //     message: "Please check the internet connection.",
    //     duration: 3000,
    //     position: 'bottom'
    //   });
    //   toast.present();
    // }

    // pushObject.on('notification').subscribe((notification: any) => {
    //   // if (notification.additionalData.foreground) {
    //   //   let toast = this.toast.create({
    //   //     message: notification.message,
    //   //     duration: 3000,
    //   //     position: 'bottom'
    //   //   });
    //   //   toast.present();
    //   // }
    //   pushObject.finish().then(e => {
    //     console.log(e);
    //   }).catch(e => {
    //     console.log("ERROR NOTIFICATION", e);
    //   })
    // });
  }

  googleLogin() {
    let env = this;
    // env.fcm.subscribeToTopic('wedlive');
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    if (env.network.type !== 'none') {
      loading.present();
      env.googlePlus.login({
        'scopes': '', // optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
        'webClientId': '738030326158-nv974th0q7oi4c58dqua7evj4mcqs2du.apps.googleusercontent.com', // optional clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
        'offline': true
      })
        .then(function (user) {
          // env.fcm.getToken().then(token => {
          env.regData = {
            EmailAddress: user.email,
            UserToken: user.userId,
            DeviceId: env.token ? env.token : '',
            DeviceName: '',
            UserName: user.displayName,
            UserImageURL: user.imageUrl
          }
          env.nativeStorage.setItem('loginPlatform',
            {
              platform: '1'
            }).then(function () {
              loading.dismiss();
              env.registerUser();
            }, function (error) {
              loading.dismiss();
              console.log(error);
            });
        }, function (error) {
          loading.dismiss();
          console.log(error);
        }).catch(err => {
          console.log(err);
        })
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

  fbLogin() {
    let permissions = new Array<string>();
    let env = this;
    // env.fcm.subscribeToTopic('wedlive');
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    if (env.network.type !== 'none') {
      loading.present();
      //the permissions your facebook app needs from the user
      permissions = ["public_profile", 'user_friends', 'email'];
      env.fb.login(permissions)
        .then(function (response) {
          let userId = response.authResponse.userID;
          let params = new Array<string>();
          //Getting name and gender properties
          env.fb.api("/me?fields=name,gender,email", params)
            .then(function (user) {
              // env.fcm.getToken().then(token => {
              env.regData = {
                EmailAddress: user.email,
                UserToken: userId,
                DeviceId: env.token ? env.token : '',
                DeviceName: '',
                UserName: user.name,
                UserImageURL: "https://graph.facebook.com/" + userId + "/picture?type=large"
              }
              env.nativeStorage.setItem('loginPlatform',
                {
                  platform: '2'
                }).then(function () {
                  loading.dismiss();
                  env.registerUser();
                }, function (error) {
                  loading.dismiss();
                  console.log(error);
                });
            }, function (error) {
              loading.dismiss();
              console.log(error);
            });
        }, function (error) {
          loading.dismiss();
          console.log(error);
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
    //this.navCtrl.setRoot(MenuPage);
  }

  registerUser() {
    let env = this;
    let userData: any;
    let loading = env.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    env.apiService.register(env.regData).then(fbResult => {
      if (JSON.parse(fbResult['_body']) != null) {
        userData = JSON.parse(fbResult['_body']);
      }
      env.apiService.load(env.regData.UserToken).then(result => {
        if (result[0] && userData === undefined) {
          userData = result[0];
        }
        env.nativeStorage.setItem('user',
          {
            name: userData.UserName,
            picture: userData.UserImageUrl,
            isAdmin: userData.IsAdmin,
            Status: userData.Status,
            Id: userData.Id,
            DeviceId: env.token
          }).then(function () {
            env.nativeStorage.getItem('loginPlatform')
              .then(function (userData) {
                if (userData.platform == "2") {
                  env.fb.logout().then(function (response) {
                    env.navCtrl.setRoot(MenuPage);
                    loading.dismiss();
                  }).catch(function (error) {
                    loading.dismiss();
                    console.log(error);
                  });
                }
                if (userData.platform == "1") {
                  env.googlePlus.logout()
                    .then(response => {
                      env.navCtrl.setRoot(MenuPage);
                      loading.dismiss();
                    }, function (error) {
                      loading.dismiss();
                      console.log(error);
                    })
                }
              });
          }, function (error) {
            loading.dismiss();
            console.log(error);
          });
      }, (err) => {
        console.log(err);
        loading.dismiss();
      });
    }, (err) => {
      console.log(err);
      loading.dismiss();
    });
  }
}
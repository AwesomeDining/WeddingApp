import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

//import { MainPage } from '../pages/main/main';
import { MenuPage } from '../pages/menu/menu';
import { LoginPage } from '../pages/login/login';
import { NativeStorage } from '@ionic-native/native-storage';
import { Push, PushObject, PushOptions } from '@ionic-native/push';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = LoginPage;

  @ViewChild(Nav) nav;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,
    public nativeStorage: NativeStorage, private push: Push, public toast: ToastController) {
    this.initializeApp();

    // firebase.auth().getRedirectResult().then(function (result) {
    //   if (result.credential) {
    //     var token = result.credential.accessToken;
    //     var user = result.user;
    //     this.rootPage = MenuPage;
    //     console.log(token, user);
    //   }
    // }).catch(function (error) {
    //   // Handle Errors here.
    //   var errorMessage = error.message;
    //   console.log(errorMessage);
    // });

  }

  initializeApp() {
    this.platform.ready().then(() => {

      // this.fcm.onNotification().subscribe(data => {
      //   if (data.wasTapped) {
      //     console.log("Received in background");
      //   } else {
      //     console.log("Received in foreground");
      //   };
      // });
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.push.hasPermission()
        .then((res: any) => {

          if (res.isEnabled) {
            console.log('We have permission to send push notifications');
          } else {
            console.log('We do not have permission to send push notifications');
          }

        });

      const options: PushOptions = {
        android: {
          senderID: '885563698719',
          sound: 'true'
        },
        ios: {
          alert: 'true',
          badge: true,
          sound: 'true'
        },
        windows: {},
        browser: {
          pushServiceURL: 'http://push.api.phonegap.com/v1/push'
        }
      };

      const pushObject: PushObject = this.push.init(options);

      pushObject.on('notification').subscribe((notification: any) => {
        if (notification.additionalData.foreground) {
          let toast = this.toast.create({
            message: notification.message,
            duration: 3000,
            position: 'bottom'
          });
          toast.present();
        }
        else {
          let env = this;
          env.nativeStorage.getItem('user')
            .then(function (data) {
              if (data.Status === 10) {
                env.nav.setRoot(LoginPage);
              }
              else {
                // user is previously logged and we have his data
                // we will let him access the app
                env.nav.setRoot(MenuPage);
              }
            }, function (error) {
              //we don't have the user data so we will ask him to log in
              env.nav.setRoot(LoginPage);
            });
        }
      });

      pushObject.on('registration').subscribe((registration: any) => {
        this.nativeStorage.setItem('deviceToken', {
          token: registration.registrationId
        }).then(() => {
          console.log('Device registered', registration);
          let env = this;
          env.nativeStorage.getItem('user')
            .then(function (data) {
              if (data.Status === 10) {
                env.nav.setRoot(LoginPage);
              }
              else {
                // user is previously logged and we have his data
                // we will let him access the app
                env.nav.setRoot(MenuPage);
              }
            }, function (error) {
              //we don't have the user data so we will ask him to log in
              env.nav.setRoot(LoginPage);
            });
          console.log('Device registered', registration);
        })
      });

      pushObject.on('error').subscribe(error => {
        let toast = this.toast.create({
          message: "Something went wrong."
        });
        toast.present();
      });

      // this.pushSetup();

    });
  }
}
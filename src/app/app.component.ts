import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, ToastController, App } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

//import { MainPage } from '../pages/main/main';
import { MenuPage } from '../pages/menu/menu';
import { LoginPage } from '../pages/login/login';
import { NativeStorage } from '@ionic-native/native-storage';
// import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { Firebase } from '@ionic-native/firebase';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = LoginPage;

  @ViewChild(Nav) nav;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,
    public nativeStorage: NativeStorage, public toast: ToastController, public appCtrl: App, private firebase: Firebase) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      //this.pushSetup();
      let env = this;
      env.firebase.hasPermission().then((res: any) => {
        console.log("Permission Granted:");
      }).catch(err => {
        console.log("NotAllowed");
      });

      env.nativeStorage.getItem('user')
        .then(function (data) {
          if (data.Status === 10) {
            env.nav.setRoot(LoginPage);
          }
          else {
            env.nav.setRoot(MenuPage);
          }
        }, function (error) {
          env.firebase.getToken()
            .then(token => {
              console.log("Firebase Token: =>" + token);
              env.nav.setRoot(LoginPage, {
                Token: token
              });
            }) // save the token server-side and use it to push notifications to this device
            .catch(error => console.error('Error getting token', error));
          // env.nav.setRoot(LoginPage);
        });

      env.firebase.onNotificationOpen()
        .subscribe((res) => {
          if (res.tap) {
            console.log(res);
            // env.nav.setRoot(MenuPage);
            env.appCtrl.getRootNav().setRoot(MyApp);
            // this else if is for foreground mode
          } else if (!res.tap) {
            //this.navCtr.push(Page)
            console.log("Not Tapped: " + res);
            let toast = this.toast.create({
              message: res.body,
              duration: 3000,
              position: 'bottom'
            });
            toast.present();
            env.appCtrl.getRootNav().setRoot(MyApp);
            // env.nav.setRoot(MenuPage);
          }
        });
    });
  }

  // this.platform.resume.subscribe(() => {
  //   let env = this;
  //   env.nativeStorage.getItem('user')
  //     .then(function (data) {
  //       if (data.Status === 10) {
  //         env.nav.setRoot(LoginPage);
  //       }
  //       else {
  //         // user is previously logged and we have his data
  //         // we will let him access the app
  //         // env.nav.setRoot(MenuPage);
  //         env.appCtrl.getRootNav().setRoot(MyApp);
  //       }
  //     }, function (error) {
  //       //we don't have the user data so we will ask him to log in
  //       env.nav.setRoot(LoginPage);
  //     });
  // });
}

  // pushSetup() {

  //   this.push.hasPermission()
  //     .then((res: any) => {

  //       if (res.isEnabled) {
  //         console.log('We have permission to send push notifications');
  //       } else {
  //         console.log('We do not have permission to send push notifications');
  //       }

  //     });

  //   const options: PushOptions = {
  //     android: {
  //       senderID: '885563698719',
  //       sound: 'true',
  //       forceShow: true,
  //     },
  //     ios: {
  //       alert: 'true',
  //       badge: true,
  //       sound: 'true'
  //     },
  //     windows: {},
  //     browser: {
  //       pushServiceURL: 'http://push.api.phonegap.com/v1/push'
  //     }
  //   };

  //   const pushObject: PushObject = this.push.init(options);

  //   pushObject.on('notification').subscribe((notification: any) => {
  //     // if (notification.additionalData.foreground) {
  //     //   let toast = this.toast.create({
  //     //     message: notification.message,
  //     //     duration: 3000,
  //     //     position: 'bottom'
  //     //   });
  //     //   toast.present();
  //     // }
  //     pushObject.finish().then(e => {
  //       console.log(e);
  //     }).catch(e => {
  //       console.log("ERROR NOTIFICATION", e);
  //     })
  //   });

  //   // pushObject.on('registration').subscribe((registration: any) => {
  //   //   this.nativeStorage.setItem('deviceToken', {
  //   //     token: registration.registrationId
  //   //   }).then(() => {
  //   //     console.log('Device registered', registration);
  //   //   })
  //   // });

  //   pushObject.on('error').subscribe(error => {
  //     let toast = this.toast.create({
  //       message: "Something went wrong.",
  //       duration: 3000,
  //       position: 'bottom'
  //     });
  //     toast.present();
  //   });
  // }

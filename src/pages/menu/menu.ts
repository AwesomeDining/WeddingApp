import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Nav, LoadingController, ToastController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { LoginPage } from '../login/login';
import { ContactdetailPage } from '../contactdetail/contactdetail';
import { PendingRequestsPage } from '../pending-requests/pending-requests';
import { UsersPage } from '../users/users';
import { CreateeventPage } from '../createevent/createevent';
import { SavedatePage } from '../savedate/savedate';
import { EventPage } from '../events/events';
import { TakeMeToVenuePage } from '../takemetovenue/takemetovenue';
import { ImagegalleryPage } from '../imagegallery/imagegallery';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
// import { Facebook } from '@ionic-native/facebook';
// import { GooglePlus } from '@ionic-native/google-plus';
import { Network } from '@ionic-native/network';
import { NativeStorage } from '@ionic-native/native-storage';

/**
 * Generated class for the MenuPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {

  public user = { ImageURL: '', Name: '', isAdmin: false, Status: '', Id: '' };
  private rootPage;
  private homePage;
  private createEventPage;
  private saveDatePage;
  private imageGalleryPage;
  private takeMeToVenuePage;
  private usersPage;
  private pendingRequestPage;
  private rsvpPage;
  private eventsPage;
  @ViewChild(Nav) nav: Nav;
  public allUser: any;
  token: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public nativeStorage: NativeStorage,
    public apiService: ApiServiceProvider, private loadingCtrl: LoadingController, public network: Network, public toast: ToastController) {
    this.rootPage = HomePage;
    this.homePage = HomePage;
    this.createEventPage = CreateeventPage;
    this.saveDatePage = SavedatePage;
    this.imageGalleryPage = ImagegalleryPage;
    this.takeMeToVenuePage = TakeMeToVenuePage;
    this.usersPage = UsersPage;
    this.pendingRequestPage = PendingRequestsPage;
    this.rsvpPage = ContactdetailPage;
    this.eventsPage = EventPage;
    console.log("Inside MenuPageConstructor");
    let env = this;
    // let loading = env.loadingCtrl.create({
    //   content: 'Please wait...'
    // });
    // loading.present();

    // env.nativeStorage.getItem('user')
    //   .then(function (userData) {
    //     console.log("Inside USER API");
    //     env.user.ImageURL = userData.picture;
    //     env.user.Name = userData.name;
    //     env.user.isAdmin = userData.isAdmin;
    //     env.user.Status = userData.Status;
    //     if (userData.Status === 10) {
    //       if (env.network.type !== 'none') {
    //         env.apiService.load("null")
    //           .then(data => {
    //             console.log("USER API CALLED");
    //             env.allUser = data;
    //             env.allUser.forEach(element => {
    //               if (element.Id == userData.Id) {
    //                 env.user.Status = element.Status;
    //                 console.log("USER STATUS CHANGED");
    //                 env.nativeStorage.remove('user');
    //                 env.nativeStorage.setItem('user',
    //                   {
    //                     name: userData.name,
    //                     picture: userData.picture,
    //                     isAdmin: userData.IsAdmin,
    //                     Status: element.Status,
    //                     Id: userData.Id
    //                   }).then(function () {
    //                     console.log("USER STORAGE RESET");
    //                   });
    //               }
    //             });
    //             loading.dismiss();
    //           });
    //       }
    //       else {
    //         let toast = this.toast.create({
    //           message: "Please check the internet connection.",
    //           duration: 3000,
    //           position: 'bottom'
    //         });
    //         toast.present();
    //       }
    //     }
    //     // user is previously logged and we have his data
    //     // we will let him access the app
    //     //env.navCtrl.push(HomePage);        
    //     loading.dismiss();
    //   }, function (error) {
    //     loading.dismiss();
    //     console.log(error);
    //     //we don't have the user data so we will ask him to log in
    //     //env.navCtrl.push(LoginPage);
    //   });
    env.nativeStorage.getItem('user')
      .then(function (userData) {
        env.user.ImageURL = userData.picture;
        env.user.Name = userData.name;
        env.user.isAdmin = userData.isAdmin;
        env.user.Status = userData.Status;
        env.user.Id = userData.Id;
        // user is previously logged and we have his data
        // we will let him access the app
        //env.navCtrl.push(HomePage);        
      }, function (error) {
        //we don't have the user data so we will ask him to log in
        //env.navCtrl.push(LoginPage);
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MenuPage');
  }

  Logout() {
    var nav = this.navCtrl;
    let env = this;
    let loading = env.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    env.nativeStorage.getItem('deviceToken').then(function (deviceToken) {
      let logOutParams = {
        DeviceId: deviceToken.token,
        Id: env.user.Id
      }
      env.token = deviceToken.token;
      env.apiService.logout(logOutParams).then(data => {
        env.nativeStorage.clear();
        env.nativeStorage.setItem('deviceToken', {
          token: env.token
        }).then(() => {
          console.log('Device registered', env.token);
        })
        console.log(data);
        nav.push(LoginPage);
        loading.dismiss();
      });
    }, err => {
      console.log(err);
      loading.dismiss();
    });

    // env.nativeStorage.getItem('loginPlatform')
    //   .then(function (userData) {
    //     if (userData.platform == "2") {
    //       env.fb.logout().then(function (response) {
    //         //user logged out so we will remove him from the NativeStorage
    //         env.nativeStorage.remove('user');
    //         env.nativeStorage.remove('loginPlatform');
    //         nav.push(LoginPage);
    //       }, function (error) {
    //         console.log(error);
    //       });
    //     }
    //     if (userData.platform == "1") {
    //       env.googlePlus.logout()
    //         .then(response => {
    //           console.log(response);
    //           env.nativeStorage.remove('user');
    //           env.nativeStorage.remove('loginPlatform');
    //           nav.push(LoginPage);
    //         }, function (error) {
    //           console.log(error);
    //         })
    //     }
    //   });
  }

  openPage(p) {
    if (p.name !== "ImagegalleryPage") {
      this.rootPage = p;
    }
    else {
      let loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      if (this.network.type !== 'none') {
        loading.present();
        this.apiService.loadGallery().then(data => {
          this.navCtrl.push(ImagegalleryPage, {
            ImageUrl: data
          })
          loading.dismiss();
        }, function (error) {
          console.log(error);
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

  openHome() {
    this.navCtrl.push(HomePage);
  }

  savetheDate() {
    this.navCtrl.push(SavedatePage);
  }

  showEventPage() {
    this.navCtrl.push(CreateeventPage);
  }

  takemetovenue() {
    this.navCtrl.push(TakeMeToVenuePage);
  }

  openAllUsers() {
    this.navCtrl.push(UsersPage);
  }

  openPendingRequest() {
    this.navCtrl.push(PendingRequestsPage);
  }

  openContactUs() {
    this.navCtrl.push(ContactdetailPage);
  }

  // openSamplePage() {
  //   this.navCtrl.push(SamplePage);
  // }

  showGallery() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    if (this.network.type !== 'none') {
      loading.present();
      this.apiService.loadGallery().then(data => {
        this.navCtrl.push(ImagegalleryPage, {
          ImageUrl: data
        })
        loading.dismiss();
      }, function (error) {
        console.log(error);
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

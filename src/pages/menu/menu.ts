import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Nav } from 'ionic-angular';
import { HomePage } from '../home/home';
import { LoginPage } from '../login/login';
import { ContactdetailPage } from '../contactdetail/contactdetail';
import { PendingRequestsPage } from '../pending-requests/pending-requests';
import { UsersPage } from '../users/users';

import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';

import { NativeStorage } from '@ionic-native/native-storage';

/**
 * Generated class for the MenuPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {

  public user = { ImageURL: '', Name: '', isAdmin: false, Status: '' };
  rootPage = HomePage;
  @ViewChild(Nav) nav: Nav;
  constructor(public navCtrl: NavController, private fb: Facebook, public navParams: NavParams, public nativeStorage: NativeStorage, private googlePlus: GooglePlus) {
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
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MenuPage');
  }

  Logout() {
    var nav = this.navCtrl;
    let env = this;
    env.nativeStorage.getItem('user')
      .then(function (userData) {
        env.nativeStorage.remove('user');
        nav.setRoot(LoginPage);
      }, function (error) {
        console.log(error);
      });
  }

  openHome() {
    this.navCtrl.setRoot(HomePage);
  }

  openAllUsers() {
    this.navCtrl.push(UsersPage);
  }

  openCreateEvent() {

  }

  openPendingRequest() {
    this.navCtrl.push(PendingRequestsPage);
  }

  openContactUs() {
    this.navCtrl.push(ContactdetailPage);
  }

}

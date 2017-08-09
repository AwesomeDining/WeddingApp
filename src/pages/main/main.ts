import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoginPage} from '../login/login';
import { MenuPage } from '../menu/menu';
import { NativeStorage } from '@ionic-native/native-storage';

@Component({
  selector: 'page-main',
  templateUrl: 'main.html'
})
export class MainPage {

  constructor(public navCtrl: NavController, public nativeStorage: NativeStorage) {

  }

  startPage(){

    let env = this;
      this.nativeStorage.getItem('user')
      .then( function (data) {
        // user is previously logged and we have his data
        // we will let him access the app
        env.navCtrl.setRoot(MenuPage);        
      }, function (error) {
        //we don't have the user data so we will ask him to log in
        env.navCtrl.setRoot(LoginPage);
      });
  }
}

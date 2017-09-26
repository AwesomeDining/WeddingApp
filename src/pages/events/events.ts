import { Component } from '@angular/core';
import { NavController, LoadingController, ToastController } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { EventdetailPage } from '../eventdetail/eventdetail';
import { Network } from '@ionic-native/network';
import { ApiServiceProvider } from '../../providers/api-service/api-service';

/**
 * Generated class for the SavedatePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-events',
  templateUrl: 'events.html',
})
export class EventPage {

  public people: any;

  public user = { ImageURL: '', Name: '', isAdmin: false, Status: 0, sts: '' };
  events: any;
  constructor(public navCtrl: NavController, public apiService: ApiServiceProvider, public nativeStorage: NativeStorage, private loadingCtrl: LoadingController,
    public network: Network, public toast: ToastController) {
    let env = this;
    env.nativeStorage.getItem('user')
      .then(function (userData) {
        env.user.ImageURL = userData.picture;
        env.user.Name = userData.name;
        env.user.isAdmin = userData.isAdmin;
        env.user.Status = userData.Status;

        if (env.user.Status == 10)
          env.user.sts = "Pending";
        else if (env.user.Status == 30) {
          env.user.sts = "Rejected";
        }
        else {
          env.user.sts = "Approved";
        }
        // user is previously logged and we have his data
        // we will let him access the app
        //env.navCtrl.push(HomePage);        
      }, function (error) {
        //we don't have the user data so we will ask him to log in
        //env.navCtrl.push(LoginPage);
      });

    env.getEvents();
  }

  getEvents() {
    let env = this;
    let loading = env.loadingCtrl.create({
      content: 'Please wait...'
    });
    if (env.network.type !== 'none') {
      loading.present();
      env.apiService.getEvents(true).then(data => {
        env.events = data;
        // env.events.forEach(element => {
        //   let desc = element.Description.length > 35 ? element.Description.substring(0, 35).concat("...") : element.Description;
        //   element.Description = desc;
        // });
        loading.dismiss();
      }, function (err) {
        console.log(err);
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

  getEventDetail(data) {
    let env = this;
    let loading = env.loadingCtrl.create({
      content: 'Please wait...'
    });
    if (env.network.type !== 'none') {
      loading.present();
      env.apiService.getEventDetail(data.Id).then(result => {
        env.navCtrl.push(EventdetailPage, {
          EventData: result
        });
        loading.dismiss();
      }, function (error) {
        console.log(error);
        loading.dismiss();
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

  doRefresh(refresher) {
    if (this.network.type !== 'none') {
      let env = this;
      let loading = env.loadingCtrl.create({
        content: 'Please wait...'
      });
      if (env.network.type !== 'none') {
        loading.present();
        env.apiService.getEvents(true).then(data => {
          env.events = data;
          // env.events.forEach(element => {
          //   let desc = element.Description.length > 35 ? element.Description.substring(0, 35).concat("...") : element.Description;
          //   element.Description = desc;
          // });
          if (refresher != 0)
            refresher.complete();
          loading.dismiss();
        }, function (err) {
          console.log(err);
          loading.dismiss();
        });
      }
    }
    else {
      let toast = this.toast.create({
        message: "Please check the internet connection.",
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
      refresher.complete();
    }
  }
}
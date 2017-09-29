import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { Geolocation } from '@ionic-native/geolocation';
import { Toast } from '@ionic-native/toast';
import { NativeStorage } from '@ionic-native/native-storage';
import { Network } from '@ionic-native/network';
import { EditeventPage } from '../editevent/editevent';
import { ModalController } from 'ionic-angular';
import { ImageslidePage } from '../imageslide/imageslide';
import { ImagegalleryPage } from '../imagegallery/imagegallery';

/**
 * Generated class for the EventdetailPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-eventdetail',
  templateUrl: 'eventdetail.html'
})
export class EventdetailPage {

  EventData: any;
  imageCount: any;
  eventLatitude: any;
  eventLongitude: any;
  currLat: any;
  currLong: any;
  isAdmin: any;

  ImageUrl: Array<any> = [];
  noSeeBtn: any;
  videoURL: any;
  videoArr = [];
  videoLength: any;
  isVideoCount: boolean;
  isLocationAvailable: boolean;

  images: Array<string>;
  grid: Array<Array<string>>; //array of arrays
  constructor(public navCtrl: NavController, public navParams: NavParams, private toast: Toast, private loadingCtrl: LoadingController, private launchNavigator: LaunchNavigator,
    private geolocation: Geolocation, public nativeStorage: NativeStorage, public modalCtrl: ModalController,
    public network: Network, public toastServ: ToastController) {

    this.EventData = navParams.get('EventData');
    this.ImageUrl = this.EventData.ImageUrl;
    this.imageCount = this.ImageUrl.length - 1;
    this.eventLatitude = this.EventData.Lat;
    this.eventLongitude = this.EventData.Long;
    this.nativeStorage.getItem('user').then(data => {
      this.isAdmin = data.isAdmin;
    });
    this.isLocationAvailable = (this.EventData.Lat && this.EventData.Long) ? true : false;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventdetailPage');
  }

  showImage(index) {
    this.navCtrl.push(ImageslidePage,
      {
        slideIndex: index + 1,
        ImageUrl: this.ImageUrl
      });
  }

  showGallery() {
    this.navCtrl.push(ImagegalleryPage, {
      ImageUrl: this.ImageUrl
    })
  }

  Locate() {
    let env = this;
    let loading = this.loadingCtrl.create({
      content: 'Please wait...',
      showBackdrop: true,
      enableBackdropDismiss: true
    });
    if (env.network.type !== 'none') {
      if (env.eventLatitude && env.eventLongitude) {
        env.launchNavigator.availableApps().then(function (results) {
          let appAvailable = [];
          for (var app in results) {
            //console.log(env.launchNavigator.getAppDisplayName(app) + (results[app] ? " is" : " isn't") + " available");
            appAvailable.push(results[app] ? "1" : "0");
          }
          console.log(appAvailable);
          if (appAvailable.indexOf("1") > -1) {
            console.log("Available");
            loading.present();
            env.geolocation.getCurrentPosition().then((resp) => {
              env.currLat = resp.coords.latitude;
              env.currLong = resp.coords.longitude;
              loading.dismiss();
              env.launchNavigator.navigate([env.eventLatitude, env.eventLongitude], {
                start: "" + env.currLat + "," + env.currLong + ""
              }).catch((error) => {
                loading.dismiss();
                console.log(error);
              });
            }).catch((error) => {
              loading.dismiss();
              console.log('Error getting location', error);
            });
          }
          else {
            let toastApps = env.toastServ.create({
              message: "Map Application Not Found in Phone.",
              duration: 3000,
              position: 'bottom'
            });
            toastApps.present();
          }
        });
      }
      else {
        loading.dismiss();
        env.toast.show('Location not provided', '5000', 'bottom').subscribe(
          toast => {
            console.log(toast);
          }
        );
      }
    }
    else {
      let toast = env.toastServ.create({
        message: "Please check the internet connection.",
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
    }
  }

  EditEvent() {
    this.navCtrl.push(EditeventPage, {
      EventData: this.EventData
    });
  }

}
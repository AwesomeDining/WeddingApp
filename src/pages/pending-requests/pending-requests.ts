import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, Loading } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';

import { ApiServiceProvider } from '../../providers/api-service/api-service';

@Component({
  selector: 'page-pending-requests',
  templateUrl: 'pending-requests.html',
})
export class PendingRequestsPage {

  public people: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public apiService: ApiServiceProvider,
    private loadingCtrl: LoadingController, public nativeStorage: NativeStorage) {
    this.loadPeople();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PendingRequestsPage');
  }

  loadPeople() {
    let env = this;
    let loading = env.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    this.apiService.GetApprovalPendingUsersInfo()
      .then(data => {
        env.people = data;
        env.people.forEach(element => {
          let url = element.UserImageUrl;
          element.ImageUrl = url;
        });
        loading.dismiss();
      });
  }

  public accept(event, item) {
    let env = this;
    event.stopPropagation();
    let loading = env.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.apiService.acceptUser(item.Id).then((result) => {
      loading.present();
      env.loadPeople();
      loading.dismiss();
    }, (err) => {
      console.log(err);
      loading.dismiss();
    });
  }

  public cancel(event, item) {
    let env = this;
    event.stopPropagation();
    let loading = env.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.apiService.rejectUser(item.Id).then((result) => {
      loading.present();
      env.loadPeople();
      loading.dismiss();
    }, (err) => {
      console.log(err);
      loading.dismiss();
    });
  }
}

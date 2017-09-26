import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, Loading, AlertController, ToastController } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { Network } from '@ionic-native/network';
import { ApiServiceProvider } from '../../providers/api-service/api-service';

@Component({
  selector: 'page-pending-requests',
  templateUrl: 'pending-requests.html',
})
export class PendingRequestsPage {

  public people: any;
  public ids: any[] = [];
  public selectDone: boolean;
  public selectCancel: boolean;
  public IdContainer = { ids: [] };

  checked: boolean = true;
  constructor(public navCtrl: NavController, public navParams: NavParams, public apiService: ApiServiceProvider,
    private loadingCtrl: LoadingController, public nativeStorage: NativeStorage, private alertCtrl: AlertController,
    public network: Network, public toast: ToastController) {
    this.loadPeople();

    this.selectDone = false;
    this.selectCancel = false;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PendingRequestsPage');
  }

  loadPeople() {
    let env = this;
    let loading = env.loadingCtrl.create({
      content: 'Please wait...'
    });
    if (env.network.type !== 'none') {
      loading.present();
      this.apiService.GetApprovalPendingUsersInfo()
        .then(data => {
          env.people = data;
          env.people.forEach(element => {
            let url = element.UserImageUrl;
            element.ImageUrl = url;
            element.checked = false;
          });
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

  EnableSelect() {
    this.selectDone = true;
    this.selectCancel = true;
  }

  unSelectAll() {
    this.selectDone = false;
    this.selectCancel = false;
  }

  SelectAll() {
    let alert = this.alertCtrl.create({
      message: 'Confirm ?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Ok',
          handler: () => {
            this.SelectAllPendingRequests();
            console.log('Buy clicked');
          }
        }
      ]
    });
    alert.present();
  }

  SelectAllPendingRequests() {
    let env = this;
    let loading = env.loadingCtrl.create({
      content: 'Please wait...'
    });
    if (env.network.type !== 'none') {
      loading.present();
      env.people.forEach(element => {
        if (element.checked == true && env.ids.indexOf(element.Id) == -1) {
          env.ids.push(element.Id);
        }
      });
      env.people.forEach(element => {
        element.checked = false;
      });
      env.IdContainer.ids = env.ids;
      this.apiService.acceptAllUser(env.IdContainer)
        .then((result) => {
          loading.present();
          env.loadPeople();
          loading.dismiss();
        }, (err) => {
          console.log(err);
          env.ids = [];
          env.IdContainer.ids = [];
          env.selectCancel = false;
          env.selectDone = false;
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

  public accept(event, item) {
    let env = this;
    event.stopPropagation();
    let loading = env.loadingCtrl.create({
      content: 'Please wait...'
    });
    if (env.network.type !== 'none') {
      this.apiService.acceptUser(item.Id).then((result) => {
        loading.present();
        env.loadPeople();
        loading.dismiss();
      }, (err) => {
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

  public cancel(event, item) {
    let env = this;
    event.stopPropagation();
    let loading = env.loadingCtrl.create({
      content: 'Please wait...'
    });
    if (env.network.type !== 'none') {
      loading.present();
      this.apiService.rejectUser(item.Id).then((result) => {
        env.loadPeople();
        loading.dismiss();
      }, (err) => {
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
}

import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { Network } from '@ionic-native/network';
import { Geolocation } from '@ionic-native/geolocation';
import { Toast } from '@ionic-native/toast';
import { NativeStorage } from '@ionic-native/native-storage';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
/**
 * Generated class for the EventdetailPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
    selector: 'page-takemetovenue',
    templateUrl: 'takemetovenue.html'
})
export class TakeMeToVenuePage {

    public people: any;

    public user = { ImageURL: '', Name: '', isAdmin: false, Status: 0, sts: '' };
    events: any;
    eventLatitude: any;
    eventLongitude: any;
    currLat: any;
    currLong: any;
    constructor(public navCtrl: NavController, public navParams: NavParams, private toast: Toast, private loadingCtrl: LoadingController,
        private launchNavigator: LaunchNavigator, private geolocation: Geolocation, public nativeStorage: NativeStorage, public apiService: ApiServiceProvider, public network: Network, public toastServ: ToastController) {
        let env = this;
        env.nativeStorage.getItem('user')
            .then(function (userData) {
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
            env.apiService.getSaveDateEvents().then(data => {
                env.events = data;
                loading.dismiss();
            }, function (err) {
                console.log(err);
                loading.dismiss();
            });
        }

        else {
            let toast = this.toastServ.create({
                message: "Please check the internet connection.",
                duration: 3000,
                position: 'bottom'
            });
            toast.present();
        }
    }

    getEventLocation(event) {
        let env = this;
        let loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });
        if (env.network.type !== 'none') {
            loading.present();
            env.launchNavigator.availableApps().then(function (results) {
                let appAvailable = [];
                for (var app in results) {
                    //console.log(env.launchNavigator.getAppDisplayName(app) + (results[app] ? " is" : " isn't") + " available");
                    appAvailable.push(results[app] ? "1" : "0");
                }
                console.log(appAvailable);
                if (appAvailable.indexOf("1") > -1) {
                    console.log("Available");
                    env.apiService.getEventDetail(event.Id).then(result => {
                        if (result['Lat'] && result['Long']) {
                            env.geolocation.getCurrentPosition().then((resp) => {
                                env.currLat = resp.coords.latitude;
                                env.currLong = resp.coords.longitude;
                                loading.dismiss();
                                env.launchNavigator.navigate([result['Lat'].toString(), result['Long'].toString()], {
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
                            loading.dismiss();
                            env.toast.show('Location not provided', '5000', 'bottom').subscribe(
                                toast => {
                                    console.log(toast);
                                }
                            );
                        }
                    }, function (error) {
                        console.log(error);
                        loading.dismiss();
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
            let toast = env.toastServ.create({
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
            env.nativeStorage.getItem('user')
                .then(function (userData) {
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
            if (refresher != 0)
                refresher.complete();

        }
        else {
            let toast = this.toastServ.create({
                message: "Please check the internet connection.",
                duration: 3000,
                position: 'bottom'
            });
            toast.present();
            refresher.complete();
        }
    }
}
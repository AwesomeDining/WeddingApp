import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController, Platform, App } from 'ionic-angular';
import { ActionSheetController } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { File } from '@ionic-native/file';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { NativeStorage } from '@ionic-native/native-storage';
import { Geolocation } from '@ionic-native/geolocation';
import { ImagePicker } from 'ionic-native';

// import { MenuPage } from '../menu/menu';
// import { HomePage } from '../home/home';
import { MyApp } from '../../app/app.component';
import { PageGmapAutocomplete } from '../page-gmap-autocomplete/page-gmap-autocomplete';
import { ApiServiceProvider } from '../../providers/api-service/api-service';

/**
 * Generated class for the CreateeventPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

declare var cordova: any;
@Component({
  selector: 'page-createevent',
  templateUrl: 'createevent.html',
})
export class CreateeventPage {
  eventName: any;
  eventDescription: any;
  eventDate: any;
  isDateSaved: any;
  imageCount: any;
  myPhoto: any;
  UserId: any;

  savetheDate: any;

  currLoc = {
    Lat: 0.0,
    Long: 0.0
  };

  eventLatitude: any;
  eventLongitude: any;
  isLocationSet: boolean;
  showAll: boolean;
  imgCount: any;
  lastImage = [];
  evtData = { Name: '', Description: '', EventDate: '', IsDateSaved: true, CreatedById: 0 };
  // evtData = { Name: '', Description: '', EventDate: '', IsDateSaved: true, CreatedById: 0, Lat: 0.0, Long: 0.0 };
  constructor(public navCtrl: NavController, public navParams: NavParams, public nativeStorage: NativeStorage,
    public apiService: ApiServiceProvider, public loadingCtrl: LoadingController, public imagePicker: ImagePicker,
    public actionSheetCtrl: ActionSheetController, private camera: Camera, private transfer: Transfer, private file: File, private filePath: FilePath,
    public toastCtrl: ToastController, public platform: Platform, private geolocation: Geolocation,
    public network: Network, public appCtrl: App) {
    this.savetheDate = "false";
    this.showAll = false;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateeventPage');
  }

  public optionsFn(): void {
    console.log(this.savetheDate);
    if (this.savetheDate === "true") {
      this.showAll = true;
    }
    else {
      this.showAll = false;
    }
  }

  CreateEvent() {
    let env = this;
    let loading = env.loadingCtrl.create({
      content: 'Please wait...'
    });
    if (env.network.type !== 'none') {
      if (env.showAll) {
        if (env.eventName != undefined && env.eventName != null && env.eventName != null && env.eventDate != undefined) {
          loading.present();
          env.nativeStorage.getItem('user').then(data => {
            env.UserId = data.Id;
            env.evtData = {
              Name: env.eventName,
              Description: env.eventDescription,
              EventDate: (env.eventDate) ? env.eventDate : new Date(),
              IsDateSaved: env.showAll,
              CreatedById: data.Id
              //        Lat: env.eventLatitude,
              //      Long: env.eventLongitude
            };
            env.apiService.uploadEvent(env.evtData).then(function (data) {
              console.log(data);

              if (JSON.parse(data['_body']) != null) {
                let evtData = JSON.parse(data['_body']);
                env.uploadImage(evtData);
              }
              env.presentToast("Event Created");
              loading.dismiss();
            }, function (err) {
              console.log(err);
              loading.dismiss();
            });
          }, function (err) {
            console.log(err);
            loading.dismiss();
          });
        }
        else {
          let toast = this.toastCtrl.create({
            message: "Please enter Event Name and Event Date.",
            duration: 3000,
            position: 'bottom'
          });
          toast.present();
        }
      }
      else {
        if ((env.eventDescription != undefined && env.eventDescription != null) || (env.imgCount != undefined && env.imgCount != null)) {
          loading.present();
          env.nativeStorage.getItem('user').then(data => {
            env.UserId = data.Id;
            env.evtData = {
              Name: env.eventName,
              Description: env.eventDescription,
              EventDate: (env.eventDate) ? env.eventDate : new Date(),
              IsDateSaved: env.showAll,
              CreatedById: data.Id
              //        Lat: env.eventLatitude,
              //      Long: env.eventLongitude
            };
            env.apiService.uploadEvent(env.evtData).then(function (data) {
              console.log(data);

              if (JSON.parse(data['_body']) != null) {
                let evtData = JSON.parse(data['_body']);
                env.uploadImage(evtData);
              }
              env.presentToast("Event Created");
              loading.dismiss();
            }, function (err) {
              console.log(err);
              loading.dismiss();
            });
          }, function (err) {
            console.log(err);
            loading.dismiss();
          });
        }
        else {
          let toast = this.toastCtrl.create({
            message: "Please enter Event Description or select media.",
            duration: 3000,
            position: 'bottom'
          });
          toast.present();
        }
      }
    }
    else {
      let toast = this.toastCtrl.create({
        message: "Please check the internet connection.",
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
    }
  }

  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Choose Media',
      buttons: [
        {
          text: 'Camera',
          role: 'destructive',
          handler: () => {
            this.takePhoto(this.camera.PictureSourceType.CAMERA);
            console.log('Camera clicked');
          }
        },
        {
          text: 'Images',
          role: 'destructive',
          handler: () => {
            //this.takePhoto(this.camera.PictureSourceType.PHOTOLIBRARY);
            this.setImage();
            console.log('Select Images clicked');
          }
        },
        {
          text: 'Video',
          role: 'destructive',
          handler: () => {
            //this.takePhoto(this.camera.PictureSourceType.PHOTOLIBRARY);
            this.setVideo(this.camera.PictureSourceType.PHOTOLIBRARY);
            console.log('Select Video clicked');
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });

    actionSheet.present();
  }

  SetLocation() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Choose Location via',
      buttons: [
        {
          text: 'Current Location',
          role: 'destructive',
          handler: () => {
            let loading = this.loadingCtrl.create({
              content: 'Please wait...'
            });
            if (this.network.type !== 'none') {
              loading.present();
              this.geolocation.getCurrentPosition().then((resp) => {
                this.eventLatitude = resp.coords.latitude;
                this.eventLongitude = resp.coords.longitude;
                this.isLocationSet = true;
                loading.dismiss();
                this.presentToast("Current Location Set.");
              }).catch((error) => {
                console.log('Error getting location', error);
                loading.dismiss();
              });
            }
            else {
              let toast = this.toastCtrl.create({
                message: "Please check the internet connection.",
                duration: 3000,
                position: 'bottom'
              });
              toast.present();
            }

          }
        },
        {
          text: 'Search Location',
          role: 'destructive',
          handler: () => {
            let loading = this.loadingCtrl.create({
              content: 'Please wait...'
            });
            if (this.network.type !== 'none') {
              loading.present();
              this.geolocation.getCurrentPosition().then((resp) => {
                this.currLoc = {
                  Lat: resp.coords.latitude,
                  Long: resp.coords.longitude
                }
                this.navCtrl.push(PageGmapAutocomplete, {
                  data: this.evtData,
                  callback: this.getData,
                  currLoc: this.currLoc
                });
                loading.dismiss();
              }).catch((error) => {
                console.log('Error getting location', error);
                loading.dismiss();
              });
            }
            else {
              let toast = this.toastCtrl.create({
                message: "Please check the internet connection.",
                duration: 3000,
                position: 'bottom'
              });
              toast.present();
            }
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  getData = (data) => {
    return new Promise((resolve, reject) => {
      this.eventLatitude = data.eventLatitude;
      this.eventLongitude = data.eventLongitude;
      this.isLocationSet = true;
      resolve();
    });
  };

  setImage() {
    let options = {
      maximumImagesCount: 5,
      width: 500,
      height: 500,
      quality: 75
    }
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    ImagePicker.getPictures(options).then((imagePath) => {
      if (imagePath !== "OK") {
        imagePath.forEach(element => {
          var currentName = element.substr(element.lastIndexOf('/') + 1);
          var correctPath = element.substr(0, element.lastIndexOf('/') + 1);
          this.copyFileToLocalDir(correctPath, currentName, this.createFileName(".jpg"));
          this.imgCount++;
        });
      }
      else {
        ImagePicker.getPictures(options).then((imagePath) => {
          imagePath.forEach(element => {
            var currentName = element.substr(element.lastIndexOf('/') + 1);
            var correctPath = element.substr(0, element.lastIndexOf('/') + 1);
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName(".jpg"));
            this.imgCount++;
          });
        });
      }
    });
    loading.dismiss();
  }

  takePhoto(sourceType) {
    this.camera.getPicture({
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    }).then(imagePath => {

      let loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      loading.present();
      if (this.platform.is('android') && sourceType === 0) {
        this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName(".jpg"));
            this.imgCount++;
            loading.dismiss();
          });
      } else {
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName(".jpg"));
        this.imgCount++;
        loading.dismiss();
      }
    });
  }

  //   Since iOS 10 it's mandatory to add a NSCameraUsageDescription and NSPhotoLibraryUsageDescription in the info.plist.

  // NSCameraUsageDescription describes the reason that the app accesses the user’s camera.
  // NSPhotoLibraryUsageDescription describes the reason the app accesses the user's photo library.

  setVideo(sourceType) {
    this.camera.getPicture({
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true,
      mediaType: this.camera.MediaType.VIDEO,
      destinationType: this.camera.DestinationType.FILE_URI
    }).then(imagePath => {
      imagePath = "file://" + imagePath;
      let loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      loading.present();
      var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
      var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
      this.copyFileToLocalDir(correctPath, currentName, this.createFileName(".mp4"));
      this.imgCount++;
      loading.dismiss();
    });
  }

  // Create a new name for the image
  private createFileName(format) {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + format;
    return newFileName;
  }

  // Copy the image to a local folder
  private copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
      this.lastImage.push(newFileName);
    }, error => {
      this.presentToast('Error while storing file.');
    });
  }

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }

  // Always get the accurate path to your apps folder
  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + img;
    }
  }

  public uploadImage(evtData) {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    // Destination URL
    var url = "http://ramanwedding-001-site1.itempurl.com/api/Events/UploadFiles/" + evtData.Id + "/" + this.UserId;
    //"http://ramanwedding-001-site1.itempurl.com/api/Events/PostUserImage";


    this.lastImage.forEach(element => {
      var targetPath = this.pathForImage(element);
      // File name only
      var filename = element;

      var options = {
        fileKey: "file",
        fileName: filename,
        chunkedMode: false,
        mimeType: "multipart/form-data",
        params: { 'fileName': filename }
      };

      const fileTransfer: TransferObject = this.transfer.create();

      // Use the FileTransfer to upload the image
      fileTransfer.upload(targetPath, url, options).then(data => {
        console.log(data);
        // loading.dismiss();
        // this.presentToast('Image succesful uploaded.');
      }, err => {
        // loading.dismiss();
        this.presentToast('Error while uploading file.');
        console.log(err);
      });
    });

    loading.dismiss();
    this.presentToast('Media succesfully uploaded.');
    // File for Upload
    //    this.navCtrl.setRoot(MenuPage);
    this.appCtrl.getRootNav().setRoot(MyApp);
  }
}

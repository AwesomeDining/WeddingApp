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
import { MyApp } from '../../app/app.component';
import { PageGmapAutocomplete } from '../page-gmap-autocomplete/page-gmap-autocomplete';
import { ApiServiceProvider } from '../../providers/api-service/api-service';

/**
 * Generated class for the EditeventPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
declare var cordova: any;
@Component({
  selector: 'page-editevent',
  templateUrl: 'editevent.html',
})
export class EditeventPage {

  EventData: any;
  imageCount: any;
  eventLatitude: any;
  eventLongitude: any;
  currLat: any;
  currLong: any;
  Name: any;
  Description: any;
  EventDate: any;
  isDateSaved: Boolean;
  EventId: any;
  lastImage = [];
  UserId: any;
  evtData = { Name: '', Description: '', EventDate: '', IsDateSaved: true, CreatedById: 0, Id: 0 };
  // evtData = { Name: '', Description: '', EventDate: '', IsDateSaved: true, CreatedById: 0, Id: 0, Lat: 0.0, Long: 0.0 };
  constructor(public navCtrl: NavController, public navParams: NavParams, public nativeStorage: NativeStorage,
    public apiService: ApiServiceProvider, public platform: Platform, public loadingCtrl: LoadingController, public toastCtrl: ToastController,
    private geolocation: Geolocation, public actionSheetCtrl: ActionSheetController, public network: Network,
    private camera: Camera, private transfer: Transfer, private file: File, private filePath: FilePath, public appCtrl: App) {
    this.EventData = navParams.get('EventData');
    this.imageCount = this.EventData.ImageUrl.length - 1;
    this.Name = this.EventData.Name;
    this.Description = this.EventData.Description;
    this.EventDate = this.EventData.EventDate;
    this.EventId = this.EventData.Id;
    this.eventLatitude = this.EventData.Lat;
    this.eventLongitude = this.EventData.Long;
    this.evtData = {
      Name: this.Name,
      Description: this.Description,
      EventDate: this.EventDate,
      IsDateSaved: true,
      CreatedById: this.EventId,
      Id: this.EventId
      // Lat: this.eventLatitude,
      // Long: this.eventLongitude
    };
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditeventPage');
  }

  EditEvent() {
    let env = this;
    let loading = env.loadingCtrl.create({
      content: 'Please wait...'
    });
    if (env.network.type !== 'none') {
      loading.present();
      env.nativeStorage.getItem('user').then(data => {
        env.UserId = data.Id;
        env.evtData = {
          Name: env.Name,
          Description: env.Description,
          EventDate: (env.EventDate) ? env.EventDate : new Date(),
          IsDateSaved: true,
          CreatedById: data.Id,
          Id: env.EventId
          // Lat: env.eventLatitude,
          // Long: env.eventLongitude
        };
        env.apiService.updateEvent(env.evtData).then(function (data) {
          console.log(data);

          if (JSON.parse(data['_body']) != null) {
            let evtData = JSON.parse(data['_body']);
            env.uploadImage(evtData);
          }
          loading.dismiss();
          env.presentToast("Event edited successfully")
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
        message: "Please check the internet connection.",
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
    }
  }

  SetLocation() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Choose Location via',
      buttons: [
        {
          text: 'Current Location',
          role: 'destructive',
          handler: () => {
            if (this.network.type !== 'none') {
              let loading = this.loadingCtrl.create({
                content: 'Please wait...'
              });
              loading.present();
              this.geolocation.getCurrentPosition().then((resp) => {
                this.eventLatitude = resp.coords.latitude;
                this.eventLongitude = resp.coords.longitude;
                loading.dismiss();
                this.presentToast("Current Location Set.");
              }).catch((error) => {
                loading.dismiss();
                console.log('Error getting location', error);
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
            if (this.network.type !== 'none') {
              this.navCtrl.push(PageGmapAutocomplete, {
                data: this.evtData,
                callback: this.getData
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

  getData = (data) => {
    return new Promise((resolve, reject) => {
      this.eventLatitude = data.eventLatitude;
      this.eventLongitude = data.eventLongitude;
      //   this.isLocationSet = true;
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
        });
      }
      else {
        ImagePicker.getPictures(options).then((imagePath) => {
          imagePath.forEach(element => {
            var currentName = element.substr(element.lastIndexOf('/') + 1);
            var correctPath = element.substr(0, element.lastIndexOf('/') + 1);
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName(".jpg"));
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
            loading.dismiss();
          });
      } else {
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName(".jpg"));
        loading.dismiss();
      }
    });
  }

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

    // File for Upload
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
        //this.presentToast('Image succesful uploaded.');
      }, err => {
        // loading.dismiss();
        this.presentToast('Error while uploading file.');
        console.log(err);
      });
    });

    loading.dismiss();
    this.presentToast('Media succesfully uploaded.');

    //    this.navCtrl.setRoot(MenuPage);
    this.appCtrl.getRootNav().setRoot(MyApp);
  }
}

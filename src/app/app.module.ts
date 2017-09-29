import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { ActionSheetController } from 'ionic-angular';

import { IonicImageViewerModule } from 'ionic-img-viewer';

import * as ionicGalleryModal from 'ionic-gallery-modal';
import { HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';

import { NativeStorage } from '@ionic-native/native-storage';
import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { CallNumber } from '@ionic-native/call-number';
import { Geolocation } from '@ionic-native/geolocation';
import { Toast } from '@ionic-native/toast';
import { Network } from '@ionic-native/network';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { MenuPage } from '../pages/menu/menu';
import { PendingRequestsPage } from '../pages/pending-requests/pending-requests';
import { ContactdetailPage } from '../pages/contactdetail/contactdetail';
import { UsersPage } from '../pages/users/users';
import { CreateeventPage } from '../pages/createevent/createevent';
import { EventdetailPage } from '../pages/eventdetail/eventdetail';
import { SavedatePage } from '../pages/savedate/savedate';
import { EventPage } from '../pages/events/events';
import { EditeventPage } from '../pages/editevent/editevent';
import { ImageslidePage } from '../pages/imageslide/imageslide';
import { ImagegalleryPage } from '../pages/imagegallery/imagegallery';
import { PageGmapAutocomplete } from '../pages/page-gmap-autocomplete/page-gmap-autocomplete';
import { TakeMeToVenuePage } from '../pages/takemetovenue/takemetovenue';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ApiServiceProvider } from '../providers/api-service/api-service';
// import { CloudSettings, CloudModule } from '@ionic/cloud-angular';
import { ImagePicker } from 'ionic-native';
import { File } from '@ionic-native/file';
import { Transfer } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { Push } from '@ionic-native/push';
import { Firebase } from '@ionic-native/firebase';

//import { GoogleMaps } from '@ionic-native/google-maps'

// import firebase from 'firebase';

//import { Storage, IonicStorageModule } from '@ionic/storage';


import { HttpModule } from '@angular/http';

// firebase.initializeApp({
//   apiKey: "AIzaSyBKpZVRzbFd9C4NawcUXBES8Q3-tFk8cm4",
//   authDomain: "wedlive-33ce0.firebaseapp.com",
//   databaseURL: "https://wedlive-33ce0.firebaseio.com",
//   projectId: "wedlive-33ce0",
//   storageBucket: "wedlive-33ce0.appspot.com",
//   messagingSenderId: "885563698719"
// });

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    MenuPage,
    PendingRequestsPage,
    ContactdetailPage,
    UsersPage,
    CreateeventPage,
    EventdetailPage,
    SavedatePage,
    EditeventPage,
    ImageslidePage,
    ImagegalleryPage,
    PageGmapAutocomplete,
    TakeMeToVenuePage,
    EventPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    // CloudModule.forRoot(cloudSettings),
    IonicImageViewerModule,
    ionicGalleryModal.GalleryModalModule
    //  IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    MenuPage,
    PendingRequestsPage,
    ContactdetailPage,
    UsersPage,
    CreateeventPage,
    EventdetailPage,
    SavedatePage,
    EditeventPage,
    ImageslidePage,
    ImagegalleryPage,
    PageGmapAutocomplete,
    TakeMeToVenuePage,
    EventPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    NativeStorage,
    Facebook,
    GooglePlus,
    ImagePicker,
    CallNumber,
    LaunchNavigator,
    Geolocation,
    ActionSheetController,
    Toast,
    File,
    Camera,
    Transfer,
    FilePath,
    Network,
    Push,
    Firebase,
    { provide: HAMMER_GESTURE_CONFIG, useClass: ionicGalleryModal.GalleryModalHammerConfig },
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    ApiServiceProvider,
    ImagePicker,
    // IonicStorageModule,
    //    Storage
  ]
})
export class AppModule { }

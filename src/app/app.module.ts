import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { MainPage } from '../pages/main/main';
import { LoginPage } from '../pages/login/login';
import { MenuPage } from '../pages/menu/menu';
import { NAcceptedPage } from '../pages/n-accepted/n-accepted';
import { PendingRequestsPage } from '../pages/pending-requests/pending-requests';
import { ContactdetailPage } from '../pages/contactdetail/contactdetail';
import { UsersPage} from '../pages/users/users';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ApiServiceProvider } from '../providers/api-service/api-service';
import { CloudSettings, CloudModule } from '@ionic/cloud-angular';

import { HttpModule } from '@angular/http';

const cloudSettings: CloudSettings = {
  'core': {
    'app_id': 'APP_ID',
  },
  'push': {
    'sender_id': '974429559754',
    'pluginConfig': {
      'ios': {
        'badge': true,
        'sound': true
      },
      'android': {
        'iconColor': '#343434'
      }
    }
  }
};

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    MainPage,
    LoginPage,
    MenuPage,
    NAcceptedPage,
    PendingRequestsPage,
    ContactdetailPage,
    UsersPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    CloudModule.forRoot(cloudSettings),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    MainPage,
    LoginPage,
    MenuPage,
    NAcceptedPage,
    PendingRequestsPage,
    ContactdetailPage,
    UsersPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    NativeStorage,
    Facebook,
    GooglePlus,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    ApiServiceProvider
  ]
})
export class AppModule { }

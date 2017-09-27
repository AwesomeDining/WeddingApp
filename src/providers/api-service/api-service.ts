import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Network } from '@ionic-native/network';
import 'rxjs/add/operator/map';

/*
  Generated class for the ApiServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class ApiServiceProvider {
  allUsers: any;
  pendingUsers: any;
  contactDetail: any;
  events: any;
  isConnected: any;
  ImageURL: any;
  public API_URL = "http://ramanwedding-001-site1.itempurl.com/api/";
  public API_KEY = "AIzaSyDUACJKoehSZnVsrTH_pqnUsVUOL6RhxZY";
  constructor(public http: Http, public network: Network) {
    console.log('Hello ApiServiceProvider Provider');
  }

  // checkNetwork() {
  //   this.network.onConnect().subscribe(data => {
  //       this.isConnected = data.type;
  //     }, err => {
  //       console.log(err);
  //     });

  //     this.network.onDisconnect
  // }

  ionViewDidEnter() {
    this.network.onConnect().subscribe(data => {
      this.isConnected = data.type;
    }, err => {
      console.log(err);
    });

    this.network.onDisconnect().subscribe(data => {
      this.isConnected = data.type;
    }, err => {
      console.log(err);
    });
  }

  load(data) {
    return new Promise(resolve => {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      this.http.get(this.API_URL + 'UserInfo/GetUsersInfo/' + data, { headers: headers })
        .map(res => res.json())
        .subscribe(result => {
          this.allUsers = result;
          resolve(this.allUsers);
        });
    });
  }

  register(data) {
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      this.http.post(this.API_URL + 'UserInfo/AddUserInfo/', JSON.stringify(data), { headers: headers })
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  GetApprovalPendingUsersInfo() {
    return new Promise(resolve => {
      this.http.get(this.API_URL + 'UserInfo/GetApprovalPendingUsersInfo/')
        .map(res => res.json())
        .subscribe(data => {
          this.pendingUsers = data;
          resolve(this.pendingUsers);
        });
    });
  }

  acceptUser(data) {
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      this.http.post(this.API_URL + 'UserInfo/ApproveUser/' + data, { headers: headers })
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  rejectUser(data) {
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      this.http.post(this.API_URL + 'UserInfo/RejectUser/' + data, { headers: headers })
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  loadContact() {
    return new Promise(resolve => {
      this.http.get(this.API_URL + 'ContactUs/GetContactUsDetails/')
        .map(res => res.json())
        .subscribe(data => {
          this.contactDetail = data;
          resolve(this.contactDetail);
        });
    });
  }

  uploadEvent(data) {
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      this.http.post(this.API_URL + 'Events/CreateEvent/', JSON.stringify(data), { headers: headers })
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  updateEvent(data) {
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      this.http.put(this.API_URL + 'Events/UpdateEvent/' + data.Id, JSON.stringify(data), { headers: headers })
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  getEvents(data) {
    return new Promise(resolve => {
      this.http.get(this.API_URL + 'Events/GetEvents/' + data + '/')
        .map(res => res.json())
        .subscribe(data => {
          this.events = data;
          resolve(this.events);
        });
    });
  }

  getSaveDateEvents() {
    return new Promise(resolve => {
      this.http.get(this.API_URL + 'Events/GetEvents/true/1/')
        .map(res => res.json())
        .subscribe(data => {
          this.events = data;
          resolve(this.events);
        });
    });
  }

  getEventDetail(data) {
    return new Promise(resolve => {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      this.http.get(this.API_URL + 'Events/GetEventDetails/' + data, { headers: headers })
        .map(res => res.json())
        .subscribe(result => {
          resolve(result);
        });
    });
  }

  uploadImages(data) {
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      this.http.post(this.API_URL + 'Events/UploadFiles/1/5', JSON.stringify(data), { headers: headers })
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  acceptAllUser(data) {
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      this.http.post(this.API_URL + 'UserInfo/ApproveUsers/', JSON.stringify(data), { headers: headers })
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  searchLocation(query) {
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      this.http.post("https://maps.googleapis.com/maps/api/place/textsearch/json?query=" + query + "&key=" + this.API_KEY, { headers: headers })
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  logout(data) {
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      this.http.post(this.API_URL + "UserInfo/LogoutByModel/", JSON.stringify(data), { headers: headers })
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  loadGallery() {
    return new Promise(resolve => {
      this.http.get(this.API_URL + 'Events/GetAllImages/')
        .map(res => res.json())
        .subscribe(data => {
          this.ImageURL = data;
          resolve(this.ImageURL);
        });
    });
  }
}

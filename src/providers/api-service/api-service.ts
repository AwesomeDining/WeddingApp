import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
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
  public API_URL = "http://ramanwedding-001-site1.itempurl.com/api/";
  constructor(public http: Http) {
    console.log('Hello ApiServiceProvider Provider');
  }

  load(data) {
    // don't have the allUsers yet
    return new Promise(resolve => {
      // We're using Angular HTTP provider to request the allUsers,
      // then on the response, it'll map the JSON allUsers to a parsed JS object.
      // Next, we process the allUsers and resolve the promise with the new allUsers.

      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      this.http.get(this.API_URL + 'UserInfo/GetUsersInfo/' + data, { headers: headers })
        .map(res => res.json())
      .subscribe(result => {
          // we've got back the raw data, now generate the core schedule data
          // and save the data for later reference
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
      // We're using Angular HTTP provider to request the data,
      // then on the response, it'll map the JSON data to a parsed JS object.
      // Next, we process the data and resolve the promise with the new data.

      this.http.get(this.API_URL + 'UserInfo/GetApprovalPendingUsersInfo/')
        .map(res => res.json())
        .subscribe(data => {
          // we've got back the raw data, now generate the core schedule data
          // and save the data for later reference
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
      // We're using Angular HTTP provider to request the data,
      // then on the response, it'll map the JSON data to a parsed JS object.
      // Next, we process the data and resolve the promise with the new data.

      this.http.get(this.API_URL + 'ContactUs/GetContactUsDetails/')
        .map(res => res.json())
        .subscribe(data => {
          // we've got back the raw data, now generate the core schedule data
          // and save the data for later reference
          this.contactDetail = data;
          resolve(this.contactDetail);
        });
    });
  }

}

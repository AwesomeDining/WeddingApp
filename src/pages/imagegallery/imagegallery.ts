import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { ImageslidePage } from '../imageslide/imageslide';

/**
 * Generated class for the ImagegalleryPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-imagegallery',
  templateUrl: 'imagegallery.html',
})
export class ImagegalleryPage {

  EventData: any;
  imageCount: any;
  images: Array<string>;
  videos: Array<string>;
  grid: Array<Array<string>>;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.images = navParams.get('ImageUrl');
    //this.videos = navParams.get('VideoUrl');
    this.imageCount = this.images.length - 1;
    this.grid = Array(Math.ceil(this.imageCount / 3)); //MATHS!
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ImagegalleryPage');

    let rowNum = 0; //counter to iterate over the rows in the grid

    //for (let i = 0; i < this.images.length; i += 2) { //iterate images
    for (let i = 1; i <= this.imageCount; i += 3) { //iterate images

      this.grid[rowNum] = Array(3); //declare two elements per row

      if (this.images[i]) { //check file URI exists
        this.grid[rowNum][0] = this.images[i] //insert image
      }

      if (this.images[i + 1]) { //repeat for the second image
        this.grid[rowNum][1] = this.images[i + 1]
      }

      if (this.images[i + 2]) { //repeat for the second image
        this.grid[rowNum][2] = this.images[i + 2]
      }

      rowNum++; //go on to the next row
    }
  }

  showImage(event, rIndex, cIndex) {
    let index: any;

    index = (rIndex*3) + cIndex;
    this.navCtrl.push(ImageslidePage,
      {
        slideIndex: index + 1,
        ImageUrl: this.images
      });
  }

}

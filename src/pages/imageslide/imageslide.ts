import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Slides, ToastController } from 'ionic-angular';

/**
 * Generated class for the ImageslidePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-imageslide',
  templateUrl: 'imageslide.html',
})
export class ImageslidePage {
  // @ViewChild(Slides) slides: Slides;

  @ViewChild('mySlider') slider: Slides;
  ImageUrl: any;
  slideIndex: any;
  blankImg: any;
  slides = [];
  mySlideOptions = {
    loop: true
  };
  constructor(public navCtrl: NavController, public navParams: NavParams, public toast: ToastController) {
    this.ImageUrl = navParams.get('ImageUrl');
    this.slideIndex = navParams.get('slideIndex');
    // this.image = params.get("selectedImage");
    let slideCount = 0;
    for (var i = this.slideIndex; i < this.ImageUrl.length; i++) {
      this.slides[slideCount] = this.ImageUrl[i];
      slideCount++;
    }
    for (var j = 1; j < this.slideIndex; j++) {
      this.slides[slideCount] = this.ImageUrl[j];
      slideCount++;
    }
    let toaster = toast.create({
      message: "Double tap and swipe to zoom.",
      duration: 6000,
      position: 'bottom'
    });
    toaster.present();


    // if (this.slideIndex) {
    //   this.slides.slideTo(this.slideIndex);
    // }
  }

  // ionViewDidEnter() {
  //   if (this.slideIndex) {
  //     this.slides.slideTo(this.slideIndex);
  //     //this.slides.initialSlide = this.slideIndex;
  //   } // The 0 will avoid the transition of the slides to be shown
  // }

  // slideChanged() {
  //   let currentIndex = this.slides.getActiveIndex();
  //   console.log('Current index is', currentIndex);
  //   if (currentIndex == 1) {
  //     this.slides.lockSwipeToPrev(true);
  //   }
  // }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ImageslidePage');
  }

}

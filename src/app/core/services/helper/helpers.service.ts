import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {AlertController, AlertOptions, LoadingController, LoadingOptions, NavController, ToastController,
} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class HelpersService {
  private isLoading: boolean = false;
  private loading: any | null;
///////////////////////////////////////////////////////////////
  constructor(
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private loadCtrl: LoadingController,
    private router:Router
  ) { }
///////////////////////////////////////////////////////////////
  navigate(page: string, dir: string, path?: string):void {
    if (dir === 'back') {
      this.navCtrl.navigateBack(page);
    }
    if (dir === 'forward') {
      this.navCtrl.navigateForward(page);
    }
    if (dir === 'root') {
      this.navCtrl.navigateRoot(page);
    }
    if (path) {
      this.navCtrl.navigateForward(`${page}/${path}`);
    } else {
      return;
    }
  }

  navigateRoot(page:string):void{
    this.router.navigateByUrl(page, {replaceUrl:true})
  }
///////////////////////////////////////////////////////////////
async showLoading(message:any = null):Promise<void>{
  if(this.isLoading) return;
  this.isLoading =true;
  const options:LoadingOptions= {
    cssClass:'loadingStyle',
    showBackdrop:true,
    translucent:true,
    animated:true,
    // mode:'ios',
    spinner:'circular'
  }
  this.loading = await this.loadCtrl.create(options);
  await this.loading.present();
}
///////////////////////////////////////////////////////////////
async dismissLoading():Promise<void>{
  await this.loading?.dismiss();
}
// #######################################################
async presentToast(message: string,error:boolean=true) {
  let toast = await this.toastCtrl.create({
    message,
    mode:'md',
    duration: 3000,
    cssClass: error? 'errorStyle':'successStyle',
    position: 'top',
    buttons:[
      {
        icon:'close',
        role:'cancel'
      }
    ]
  });
  await toast.present();
}
///////////////////////////////////////////////////////////////
async confirmAlert(alertData:AlertOptions):Promise<boolean>{
  const alert = await this.alertCtrl.create({
    header:alertData?.header||'Confirm delete',
    message:alertData?.message ||'Are you sure?',
    mode:alertData?.mode||'md',
    subHeader:alertData?.subHeader,
    cssClass:'alertStyle'
  });
  await alert.present();
  const data = await alert.onDidDismiss();
  return data.role=='confirm';
}
///////////////////////////////////////////////////////////////
get api():string{
  return this.api
}
///////////////////////////////////////////////////////////////
}

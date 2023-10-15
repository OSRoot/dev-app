import { Injectable } from '@angular/core';
import { CanLoad, Router} from '@angular/router';
import { Storage } from '@ionic/storage-angular';

const INTRO_KEY = 'intro-key';
@Injectable({
  providedIn: 'root'
})
export class IntroGuard implements CanLoad {
  constructor(
    private router:Router,
    private storage:Storage
  ){}
  async canLoad(): Promise<boolean> {
    const hasSeenIntro = await this.storage.get(INTRO_KEY);
    if(hasSeenIntro==='true'){
      return true
    }
    else {
      this.router.navigateByUrl('/intro',{replaceUrl:true})
      return false
    }
  }
}

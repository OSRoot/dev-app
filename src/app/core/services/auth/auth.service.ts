import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { DataService } from '../data/data.service';
import { HelpersService } from '../helper/helpers.service';
import { NavController } from '@ionic/angular';
import { BehaviorSubject, Observable, catchError, from, map, switchMap, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

// Storage KEYS
const USER = 'user';
const ACCESS_TOKEN = 'accessToken';
const REFRESH_TOKEN = 'refreshToken';
const INTRO_KEY = 'intro-key';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  BASEAPI=this.data.baseApi;
  isAuthenticated:BehaviorSubject<boolean>=new BehaviorSubject<boolean>(false)
  constructor(
    private helper:HelpersService,
    private data:DataService,
    private storage:Storage,
    private http:HttpClient,
    private router:Router,

  ) { }

  // #####################################################################
  get accessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN);
  }
  // #####################################################################
  // #####################################################################
  async removeCredentials(): Promise<void> {
    localStorage.removeItem(ACCESS_TOKEN);
    await this.storage.remove(USER);
    await this.storage.remove(REFRESH_TOKEN);
  }
  // #####################################################################

  // #####################################################################
    // #####################################################################
    async logOut(): Promise<void> {
      await this.storage.remove('isAuthenticated')
      this.isAuthenticated.next(false)
      await this.helper.showLoading();
      await this.removeCredentials();
      await this.helper.dismissLoading();
      this.router.navigateByUrl('/login',{replaceUrl:true})
    }
// #####################################################################

///////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
login(form: any): Observable<any> {
  this.helper.showLoading();

  return this.http.post(this.BASEAPI+'/user/login', form).pipe(
    switchMap((data: any) => {
      const { the_user, accessToken, refreshToken } = data;
      return from(Promise.all([
        this.storage.set(USER, the_user),
        this.storage.set(REFRESH_TOKEN, refreshToken)
      ])).pipe(
        tap(() => {
          localStorage.setItem(ACCESS_TOKEN, accessToken);
          this.isAuthenticated.next(true);
          this.router.navigateByUrl('/tabs',{replaceUrl:true})
        })
      );
    }),
    catchError((error) => {
      this.helper.dismissLoading();
      if(error.status===0){
        this.helper.presentToast(`App is not connected to the server ( ${error.statusText} )`)
      }
      else {

        this.helper.presentToast(error.error.message)
        console.log('Error:', error);
      }
      return throwError(error);
    })
  );
}
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
signup(form: any): Observable<any> {
  console.log('started');

  this.helper.showLoading();
  return this.http.post(this.BASEAPI+'/user/register', form).pipe(
    switchMap((data: any) => {
      console.log(`From SwithcMapRxJs: `, data);

      const { user, accessToken, refreshToken } = data;
      return from(Promise.all([
        this.storage.set(USER, user),
        this.storage.set(REFRESH_TOKEN, refreshToken)
      ])).pipe(
        tap(() => {
          localStorage.setItem(ACCESS_TOKEN, accessToken);
          this.isAuthenticated.next(true);
          this.router.navigateByUrl('/profile-image',{replaceUrl:true})
        })
      );
    }),
    catchError((error) => {
      this.helper.dismissLoading();
      if(error.status===0){
        this.helper.presentToast(`App is not connected to the server ( ${error.statusText} )`)
      }
      else {

        this.helper.presentToast(error.error.message)
        console.log('Error:', error);
      }
      return throwError(error);
    })
  );
}
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
getRefreshToken(): Observable<any> {
  const PROMISE: Promise<string> = new Promise(async (resolve, reject) => {
    const token: string = await this.storage.get(REFRESH_TOKEN);
    this.data.getData('/user/refreshToken?token=' + token).subscribe(
      (res: any) => {
        localStorage.setItem(ACCESS_TOKEN, res.accessToken);
        resolve(res.token);
      },
      (err) => reject(err)
    );
  });
  return from(PROMISE);
}
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Observable, take } from 'rxjs';
// import { User } from 'src/app/interfaces/user.interface';
// import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataService {
private  BASEAPI = 'http://192.168.0.166:3007'
  private body:any;
  private user:any={};
  constructor(
    private storage:Storage,
    private http:HttpClient,

) {

}
async getToken():Promise<string>{
  return await this.storage.get('refreshToken')
}



  set Body(body:any){
    this.body = body;
  };

  get Body():any{
    return this.body;
  }

  async setUser(user:any){
    this.user = user
    await this.storage.set('user',user);
  }
  async getUser():Promise<any> {
    this.user = await this.storage.get('user')
    return this.user;
  }

  getData(endPoint: string): Observable<object> {
    return this.http.get(this.BASEAPI + endPoint).pipe(take(1));
  }

  postData(endPoing: string, body: any): Observable<object> {
  const token =  this.getToken();


  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });
    return this.http.post(this.BASEAPI + endPoing, body,{headers}).pipe(take(1));
  }

  updateData(endPoing: string, body: any): Observable<object> {
    return this.http.put(this.BASEAPI + endPoing, body).pipe(take(1));
  }

  deleteData(endPoing: string): Observable<object> {
    return this.http.delete(this.BASEAPI + endPoing).pipe(take(1));
  }

get baseApi ():string{
  return this.BASEAPI
}
}

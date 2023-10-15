import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { getToken, getMessaging} from '@angular/fire/messaging'
import { environment } from "src/environments/environment";
@Injectable({
    providedIn: 'root'
  })
export class MessagingService{
    currentMessage = new BehaviorSubject<any>(null);
    constructor (
    ){}

    requestPermission():void{
        const messaging = getMessaging();
        getToken(messaging, {vapidKey:environment.firebase.vpaidKey}).then(
          (token:string)=>{
            if(token){
              console.log(` We have the Token: `, token);
            }
            else{
              console.log(`We have a problem`);
              
            }
          }
        )
      }
}
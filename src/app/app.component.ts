import { Component,OnInit } from '@angular/core';
import { FcmService } from './core/services/fcm/fcm.service';
import { Note } from './interfaces/note.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessagingService } from './core/services/firebase/messaging.service';
import { Storage } from '@ionic/storage-angular';
import * as cordovaSQLiteDriver from 'localforage-cordovasqlitedriver';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  notes:Note[]=[];
  noteForm!:FormGroup;
  constructor (
    private fcmService:FcmService,
    private fb:FormBuilder,
    private messaging:MessagingService,
    private storage:Storage,

  ){
    this.init()
    // this.fcmService.getNotes().subscribe(
    //   (res)=>{
    //     console.log(res);
    //     this.notes = res as Note[];
    //   },
    //   (err)=>{
    //     console.log(err);

    //   }
    // )
  }
  ngOnInit(): void {
    // this.messaging.requestPermission()
    // this.noteForm = this.fb.group({
    //   title: ['', [Validators.required, Validators.minLength(5)]],
    //   text: ['', [Validators.required, Validators.minLength(8)]]
    // })
  }
  title = 'full-app';
  addNote(){
    const note = this.noteForm.value as Note;
    // console.log(note);

    this.fcmService.addNote(note);
  }
  deleteNote(note:Note){
    this.fcmService.deleteNote(note);
  }

  updateNote(id:string){
    const note:Note ={
      id : id,
      title: this.noteForm.value.title,
      text: this.noteForm.value.text
    }
    this.fcmService.updateNote(note)
  }



  //////////////////////////////////////////////////////
  async init() {
    this.storage.defineDriver(cordovaSQLiteDriver);
    this.storage.create();
  }
//////////////////////////////////////////////////////

}

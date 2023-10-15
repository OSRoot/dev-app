import { Injectable } from '@angular/core';
import { Firestore,  collectionData, docData } from '@angular/fire/firestore';
import {DocumentData, DocumentReference, addDoc, collection, deleteDoc, doc, updateDoc} from '@firebase/firestore'
import { Observable, take } from 'rxjs';
import { Note } from 'src/app/interfaces/note.interface';



@Injectable({
  providedIn: 'root'
})
export class FcmService {

  constructor(
    private firestore:Firestore
  ) { };

  getNotes(){
    const notesRef = collection(this.firestore, 'notes');
    return collectionData(notesRef, {idField:'id'});
  }

  getNoteById(id:string):Observable<Note>{
    const noteDocRef = doc(this.firestore, 'notes/'+id);
    return docData(noteDocRef, {idField:'id'}) as Observable<Note>;
  }

  addNote(note:Note):Promise<DocumentReference<DocumentData>>{
    const notesRef = collection(this.firestore, 'notes');
    return addDoc(notesRef, note);
  }

  
  deleteNote(note:Note): Promise<void>{
    const noteDocRef = doc(this.firestore, 'notes/'+note.id)
    return deleteDoc(noteDocRef);
  }

  updateNote(note:Note): Promise<void>{
    const noteDocRef = doc(this.firestore, 'notes/'+note.id);
    return updateDoc(noteDocRef, {title:note.title, text:note.text});
  }
}

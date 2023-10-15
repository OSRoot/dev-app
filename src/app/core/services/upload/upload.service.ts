import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { ElementRef, Injectable } from '@angular/core';
import {  Subject } from 'rxjs';
import { ImageObject } from 'src/app/interfaces/image.interface';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private progress$: Subject<number> = new Subject<number>();
  private isUploadInProgress$: Subject<boolean> = new Subject<boolean>();
  private images:string[]=[]
  constructor(
    private http: HttpClient
  ) { }

  get progress(): Subject<number> {
    return this.progress$
  }
  get IsInprogress(): Subject<boolean> {
    return this.isUploadInProgress$;
  }

  get Images():string[]{
    return this.images;
  }
  set Images(images:any[]){
    this.images=images;
  }
  //////////////////// Old code/////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////
  // OLD
  /////////////////////////////////////////////////////////////////////////
  // uploadAny(files:any[]) {
  //   for (let i = 0; i < files.length; i++) {
  //     const file = files[i];
  //     const freader = new FileReader();
  //     const fileUploadUrl = 'http://192.168.1.6:3007/upload/profile-image';
  //     let uploadError = false;

  //     freader.onload = async (ev: any) => {
  //       const chunkCount = Math.ceil(ev.target.result.byteLength / 1000); // Adjusted calculation
  //       const CHUNK_SIZE = 5000;
  //       const fileName = Math.random() * 1000 + file.name;

  //       for (let chunkId = 0; chunkId < chunkCount; chunkId++) {
  //         if (uploadError) {
  //           // An error has occurred, stop further processing
  //           break;
  //         }

  //         const chunk = ev.target.result.slice(chunkId * CHUNK_SIZE, chunkId * CHUNK_SIZE + CHUNK_SIZE);
  //         const headers = new HttpHeaders({
  //           'Content-Type': 'application/octet-stream',
  //           'Content-Length': chunk.byteLength.toString(),
  //           'File-Name': fileName
  //         });
  //         const options = { headers: headers };

  //         try {
  //           await this.http.post(fileUploadUrl, chunk, options).toPromise();
  //           const progress = Math.round(((chunkId + 1) * 100) / chunkCount); // Adjusted progress calculation
  //           this.progress$.next(progress);
  //           this.isUploadInProgress$.next(true);
  //         } catch (error) {
  //           if (error instanceof HttpErrorResponse) {
  //             // Handle HttpErrorResponse
  //             console.log('HTTP error occurred:', error.status);
  //             console.log('Error message:', error.message);
  //             // Additional handling specific to HttpErrorResponse
  //           } else {
  //             // Handle other types of errors
  //             console.log('An error occurred:', error);
  //           }
  //           // Set uploadError flag to true to stop further processing
  //           uploadError = true;
  //         }
  //       }
  //     };

  //     freader.readAsArrayBuffer(file);
  //   }
  // }

  /////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////


  async uploadAny(files: any[]) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      await this.uploadFileChunks(file);
    }
  }
  /////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////

  async uploadFileChunks(file: any) {
    const CHUNK_SIZE = 10000;
    const freader = new FileReader();
    const fileUploadUrl = 'http://192.168.1.6:3007/upload';
    let uploadError = false;

    freader.onload = async (ev: any) => {
      const chunkCount = Math.ceil(ev.target.result.byteLength / CHUNK_SIZE);
      const fileName = Math.random() * 1000 + file.name;

      for (let chunkId = 0; chunkId < chunkCount; chunkId++) {
        if (uploadError) {
          // An error has occurred, stop further processing
          break;
        }

        const chunk = ev.target.result.slice(chunkId * CHUNK_SIZE, chunkId * CHUNK_SIZE + CHUNK_SIZE);
        const headers = this.createChunkHeaders(chunk.byteLength, fileName);
        const options = { headers };

        try {
          await this.uploadChunk(fileUploadUrl, chunk, options);
          const progress = this.calculateProgress(chunkId, chunkCount);
          this.updateProgress(progress);
        } catch (error) {
          this.handleUploadError(error);
          uploadError = true;
        }
      }
    };

    freader.readAsArrayBuffer(file);
  }
  /////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////
  createChunkHeaders(contentLength: number, fileName: string) {
    const accestToken = localStorage.getItem('accessToken')
    console.log(accestToken);

    return new HttpHeaders({
      'Content-Type': 'application/octet-stream',
      // 'Content-Length': contentLength.toString(),
      'File-Name': fileName,
      'Authorization':`${accestToken}`
    });
  }
  /////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////

  async uploadChunk(url: string, chunk: any, options: any) {
    await this.http.post(url, chunk, options).toPromise();
    this.isUploadInProgress$.next(true);
  }

  /////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////
  calculateProgress(chunkId: number, chunkCount: number) {
    return Math.round(((chunkId + 1) * 100) / chunkCount);
  }

  /////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////
  updateProgress(progress: number) {
    this.progress$.next(progress);
  }

  /////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////
  handleUploadError(error: any) {
    if (error instanceof HttpErrorResponse) {
      // Handle HttpErrorResponse
      console.log('HTTP error occurred:', error.status);
      console.log('Error message:', error.message);
      // Additional handling specific to HttpErrorResponse
    } else {
      // Handle other types of errors
      console.log('An error occurred:', error);
    }

  }

  /////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////
  resetInput(element: ElementRef) {
    element.nativeElement.value = '';
  }
  /////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////
  async chooseMedia(files:any[]):Promise<void>{
    for(const file of files){
     const data = await this.convertBlobToBase64(file);
      this.images.push(data as string);
    }
    console.log(this.images);

  }
  async removeImage(data:string):Promise<void>{
    this.images = this.images.filter(image=>image !==data);
  }



convertBlobToBase64 = (blob: Blob) =>
new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onerror = reject;
  reader.onload = () => {
    resolve(reader.result);
  };
  reader.readAsDataURL(blob);
});

}

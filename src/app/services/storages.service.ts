
import { Injectable } from '@angular/core';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';

import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root'
})
export class StoragesService {



  constructor( private storage2 : Storage, private storage : AngularFireStorage) {  }


  uploadFile(file: File, path: string): Promise<string> {

    const imgRef = ref(this.storage2, path);

    return uploadBytes(imgRef, file)
      .then(response => getDownloadURL(imgRef))
      .then(url => {
       // console.log("Download URL", url);
        return url;
      })
      .catch(error => {
        console.log("Error uploading file", error);
        throw error;
      });
  }


  deleteFile(path: string): Promise<void> {
    const fileRef = this.storage.refFromURL(path); // Create a reference using the URL
    return fileRef.delete().toPromise();
  }


  getObjectURL(file: File): string {
    return URL.createObjectURL(file);
  }




}

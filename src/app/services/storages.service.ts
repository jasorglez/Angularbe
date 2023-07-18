
import { Injectable } from '@angular/core';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';

import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs';


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


  generateRandom() {
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    const randomLetter1 = letters.charAt(Math.floor(Math.random() * letters.length));
    const randomLetter2 = letters.charAt(Math.floor(Math.random() * letters.length));
    const randomNumber = Math.floor(Math.random() * 10);
    return randomLetter1 + randomLetter2 + randomNumber;
  }


  uploadPdf(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const filePath = `pdf/${Date.now()}_${file.name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, file);

      task.snapshotChanges()
        .pipe(
          finalize(() => {
            fileRef.getDownloadURL().subscribe(downloadUrl => {
              resolve(downloadUrl);
            }, error => {
              reject(error);
            });
          })
        )
        .subscribe();
    });
  }


}

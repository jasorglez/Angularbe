
import { Injectable } from '@angular/core';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class StoragesService {


  constructor(private storage: Storage) {

  }

  uploadFile(file: File, path: string): Promise<string> {
    const imgRef = ref(this.storage, path);

    return uploadBytes(imgRef, file)
      .then(response => getDownloadURL(imgRef))
      .then(url => {
        console.log("Download URL", url);
        return url;
      })
      .catch(error => {
        console.log("Error uploading file", error);
        throw error;
      });
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SapequipmentService {
  constructor(private http : HttpClient) { }

  getsapEquipment(plataforma: string) {
    try {
      const apiUrl = `${environment.urlAzure}api/Sapequipment?plataforma=${plataforma}`;
      return this.http.get(apiUrl)
    }catch(error){
    console.error("Error Equipment SAP", error) ;
    return null ;
    }
  }

}

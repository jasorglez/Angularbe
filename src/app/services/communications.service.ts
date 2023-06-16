import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class CommunicationsService {

constructor( public http : HttpClient) { }


getDataCommunications(){
  return this.http.get(`${environment.urlFirebase}communications.json`);
}


deleteCommunications(id:string, token: any){
  try {
    return this.http.delete(`${environment.urlFirebase}communications/${id}.json?auth=${token}`);
  }catch(error){
    console.log("Error al borrar", error) ;
    return null ;
 }

}

}

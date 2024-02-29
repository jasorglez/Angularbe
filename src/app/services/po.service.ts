import { Injectable } from '@angular/core';
import {  HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PoService {

constructor(private http:HttpClient) { }


getData( company: string,  id : number){

  try{
    return this.http.get(`${environment.urlAzure}api/Purchaseorder?Idcompany=${company}&idProveedor=${id}`);
  }catch(error)
  {
    console.error("Error al Mostrar OC ", error ) ;
    return null ;
  }
}


getDataMat( id : number){

  try{
    return this.http.get(`${environment.urlAzure}api/Matxpo?id=${id}`);
  }catch(error)
  {
    console.error("Error al Mostrar Materials X OC ", error ) ;
    return null ;
  }
}

 post(data: any, token:any){
  try{
   return this.http.post(`${environment.urlAzure}api/Purchaseorder`, data);
  }catch(error) {
   console.error("Error al guardar ", error ) ;
   return null ;
  }

}

postMat(data: any, token:any){
  try{
   return this.http.post(`${environment.urlAzure}api/Matxpo`, data);
  }catch(error) {
   console.error("Error al guardar ", error ) ;
   return null ;
  }

}

delete(id:string, token: any){
  try {
    return this.http.delete(`${environment.urlAzure}api/Purchaseorder/${id}`);

  }catch(error){
    console.error("Error al borrar", error) ;
    return null ;
 }
}


 deleteItem(id:string, token: any){
  try {
    return this.http.delete(`${environment.urlAzure}api/Matxpo/${id}`);

  }catch(error){
     console.error("Error al borrar Item", error) ;
     return null ;
   }
 }

 materialExistence(idPo: number, idMat: number)
 {
  try {
    return this.http.get(`${environment.urlAzure}api/Matxpo/id?idPo=${idPo}&idMat=${idMat}`);

  }catch(error){
     console.error("Error fetching material", error) ;
     return null ;
   }
 }



 updateMaterial(id: number, qt: number) {
  try {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      // Add any additional headers if required
    });

    return this.http.put(`${environment.urlAzure}api/Matxpo/${id}?quant=${qt}`, null, { headers });

  } catch (error) {
    console.error("Error updating material", error);
    return null;
  }
}

}

import { Injectable } from '@angular/core';
import {  HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PoService {

constructor(private http:HttpClient) { }


getData( company: string,  id : number){

  //return this.http.get(`${environment.urlAzure}api/Purchaseorder?Idcompany=${company}&idProveedor=${id}`);
  return this.http.get(`${environment.urlAzure}api/Purchaseorder?Idcompany=${company}&idProveedor=${id}`);

}

}

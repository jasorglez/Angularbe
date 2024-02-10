import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MaterialsService {

constructor(private http : HttpClient) { }

getSupplies(company: string) {
  try {
    //const apiUrl = `${environment.urlFirebase}employees.json?orderBy="id_company"&equalTo="${company}"`;
    const apiUrl = `${environment.urlAzure}api/Supplies/id_Company/${company}`;
    return this.http.get(apiUrl)
  }catch(error){
  console.error("Error Managment files", error) ;
  return null ;
  }
}

getSuppliesxid(id : string){
  try {
    //const apiUrl = `${environment.urlFirebase}employees/${id}.json`;
    const apiUrl = `${environment.urlAzure}api/Supplies/${id}`;
    return this.http.get(apiUrl)
  }catch(error){
    console.error("Error Editar el Empleado", error) ;
    return null ;
  }
}


patch(id: string, data: any, token: any) {
  try {
    const endpoint = `${environment.urlAzure}api/Suppliess/${id}`;
    return this.http.put(endpoint, data);

  } catch (error) {
    console.error("Error in patch:", error);
    return null;
  }
}


post(data: any, token:any){
 //console.log(data);
  try{
     return this.http.post(`${environment.urlAzure}api/Supplies`, data);
  }catch(error) {
   console.error("Error al guardar ", error ) ;
   return null ;
  }

}


delete(id:string, token: any){
  try {
    //return this.http.delete(`${environment.urlFirebase}employees/${id}.json?auth=${token}`);

    return this.http.delete(`${environment.urlAzure}api/Supplies/${id}`);

  }catch(error){
    console.error("Error al borrar", error) ;
    return null ;
 }

 }
}

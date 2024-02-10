import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProvidersService {

constructor(private http : HttpClient) { }

getProviders(company: string) {
  try {
    //const apiUrl = `${environment.urlFirebase}employees.json?orderBy="id_company"&equalTo="${company}"`;
    const apiUrl = `${environment.urlAzure}api/Providers/id_company/${company}`;
    return this.http.get(apiUrl)
  }catch(error){
  console.error("Error Managment files", error) ;
  return null ;
  }
}

getProvidersxid(id : string){
  try {
    //const apiUrl = `${environment.urlFirebase}employees/${id}.json`;
    const apiUrl = `${environment.urlAzure}api/Providers/${id}`;
    return this.http.get(apiUrl)
  }catch(error){
    console.error("Error Editar el Empleado", error) ;
    return null ;
  }
}


patch(id: string, data: any, token: any) {
  try {
    const endpoint = `${environment.urlAzure}api/Providers/${id}`;
    return this.http.put(endpoint, data);

  } catch (error) {
    console.error("Error in patch:", error);
    return null;
  }
}


post(data: any, token:any){
 //console.log(data);
  try{
  // return this.http.post(`${environment.urlFirebase}providers.json?auth=${token}`, data);
     return this.http.post(`${environment.urlAzure}api/Providers`, data);
  }catch(error) {
   console.error("Error al guardar ", error ) ;
   return null ;
  }

}


delete(id:string, token: any){
  try {
    //return this.http.delete(`${environment.urlFirebase}employees/${id}.json?auth=${token}`);

    return this.http.delete(`${environment.urlAzure}api/Providers/${id}`);

  }catch(error){
    console.error("Error al borrar", error) ;
    return null ;
 }

}


}

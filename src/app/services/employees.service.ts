import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {

constructor(private http : HttpClient) { }

getEmployees(company: string) {
  try {
    const apiUrl = `${environment.urlFirebase}employees.json?orderBy="id_company"&equalTo="${company}"`;
    return this.http.get(apiUrl)

  }catch(error){
  console.error("Error Managment files", error) ;
  return null ;
}

}


getEmployeexid(id : string){
  try {
    const apiUrl = `${environment.urlFirebase}employees/${id}.json`;
    return this.http.get(apiUrl)
  }catch(error){
    console.error("Error Managmen details files", error) ;
    return null ;
  }

}

patch(id:string, data: any, token:any){
  try{
   return this.http.patch(`${environment.urlFirebase}employees/${id}.json?auth=${token}`, data);
  }catch(error) {
   console.error("Error al guardar ", error ) ;
   return null ;
  }

}


post(data: any, token:any){
  try{
   return this.http.post(`${environment.urlFirebase}employees.json?auth=${token}`, data);
  }catch(error) {
   console.error("Error al guardar ", error ) ;
   return null ;
  }

}


delete(id:string, token: any){
  try {
    return this.http.delete(`${environment.urlFirebase}employees/${id}.json?auth=${token}`);
  }catch(error){
    console.error("Error al borrar", error) ;
    return null ;
 }

}


get2field( company: string) {
  const apiUrl = `${environment.urlFirebase}employees.json?orderBy="id_company"&equalTo="${company}"`;
  try {
    return this.http.get<any>(apiUrl).toPromise()
      .then(data => {
        return Object.keys(data).map(key => {
          return { key: key, name: data[key].name, email: data[key].email };
        });
      });
  } catch (error) {
    console.error('Error al Consultar tabla de Employees', error);
    return null;
  }

 }



}
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ResguardService {

constructor( private http : HttpClient) { }


getResg(idEmpleado: number) {
  try {

    const apiUrl = `${environment.urlAzure}api/Resguard/id?idEmp=${idEmpleado}`;
    return this.http.get(apiUrl)
  }catch(error){
  console.error("Error get Resguard", error) ;
  return null ;
 }
}

getItems(id: number) {
  try {

    const apiUrl = `${environment.urlAzure}api/ItemxResg?id=${id}`;
    return this.http.get(apiUrl)
  }catch(error){
  console.error("Error get items", error) ;
  return null ;
 }
}


postRes(data: any, token:any){
  //console.log(data);
   try{
      return this.http.post(`${environment.urlAzure}api/Resguard/`, data);
   }catch(error) {
    console.error("Error al guardar ", error ) ;
    return null ;
   }

 }


 postItem(data: any, token:any){
  //console.log(data);
   try{
      return this.http.post(`${environment.urlAzure}api/ItemxResg/`, data);

   }catch(error) {
    console.error("Error al guardar ", error ) ;
    return null ;
   }

 }


 deleteResguard(id:string, token: any){
  try {

    return this.http.delete(`${environment.urlAzure}api/Resguard/${id}`);

  }catch(error){
    console.error("Error al borrar", error) ;
    return null ;
 }

}


deleteItem(id:number, token: any){
  try {

    return this.http.delete(`${environment.urlAzure}api/ItemxResg/${id}`);

  }catch(error){
    console.error("Error al borrar", error) ;
    return null ;
 }
}


getDataResg(emp: string) {
  try {

    return this.http.get(`${environment.urlAzure}api/Resguard/Reporte?emp=${emp}`)
      .pipe(
        map(data => {
          const resguardDataArray = Object.values(data);
         // console.log("resguardo ARRAY", resguardDataArray);
          const filteredData = resguardDataArray.map((resgData: any, idd: number) => {
            const { c1, c2, c3, c4, c6, c7, c8 } = resgData;
            return [
              c6, c2, c3, c4,
              c1, c7, c8
            ];
          });

          //console.log("FILTERDATA", filteredData);
          return filteredData;
        })
      );
  } catch (error) {
    console.error('ERROR get list companies', error);
    return null;
  }
}




}




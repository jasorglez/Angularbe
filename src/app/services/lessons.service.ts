import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Ilessons } from '../interface/ilessons';


@Injectable({
  providedIn: 'root'
})
export class LessonsService {

constructor(private http: HttpClient) { }


findDetails(id:string){

  try {
    return this.http.get(`${environment.urlFirebase}details_lessons/${id}.json?`);
  }catch(error){
    console.error("Error al borrar", error) ;
    return null ;
 }

}


getDataLessons(project: string): Observable<any> {

  try {
    const apiUrl = `${environment.urlFirebase}lessons.json?orderBy="id_project"&equalTo="${project}"&orderBy="orden"`;
    return this.http.get(apiUrl)
  }
  catch (error){
    alert("Error al procesar" + error) ;
    return null
  }

}


postData(data: Ilessons, token:any){
  try {
    return this.http.post(`${environment.urlFirebase}lessons.json?auth=${token}`, data).pipe(
      map((response: any) => {
        return {
          key: response.name, // Suponiendo que el servidor devuelve la clave con la propiedad 'name'
          ...data // Devolver también los datos enviados en la solicitud
        };
      })
    );
  } catch (error) {
    console.error('Error al guardar', error);
    return null;
  }
}


postLessonsDetail(data: any, token:any, fieldName: string){
  try{
    const payload = {
      [fieldName]: data
    };

   return this.http.post(`${environment.urlFirebase}details_lessons.json?auth=${token}`, payload);
  }catch(error) {
   console.error("Error al guardar ", error ) ;
   return null ;
  }

}


deleteLessons(id:string, token: any){
  try {
    return this.http.delete(`${environment.urlFirebase}lessons/${id}.json?auth=${token}`);
  }catch(error){
    console.error("Error al borrar", error) ;
    return null ;
 }

}



}

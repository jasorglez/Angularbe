import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Ilearned } from '../interface/ilearned';


@Injectable({
  providedIn: 'root'
})
export class LessonslearnedService {

constructor(private http: HttpClient) { }


findDetails(id:string){

  try {
    return this.http.get(`${environment.urlFirebase}details_lessons/${id}.json?`);
  }catch(error){
    console.error("Error al borrar", error) ;
    return null ;
 }

}


getDataLearned(lesson: string): Observable<any> {

  try {
    const apiUrl = `${environment.urlFirebase}details_lessonslearned.json?orderBy="id_lesson"&equalTo="${lesson}"`;
    return this.http.get(apiUrl)
  }
  catch (error){
    alert("Error al procesar" + error) ;
    return null
  }

}




postData(data: Ilearned, token:any){
  try {
    return this.http.post(`${environment.urlFirebase}details_lessonslearned.json?auth=${token}`, data) ;
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

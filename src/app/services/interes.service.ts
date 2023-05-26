import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import { Iinteres } from '../interface/interested';

import { map, tap, catchError, filter } from 'rxjs/operators';
import { forkJoin, Observable, of, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class InteresService {

  constructor( public http:HttpClient) { }


	getDataInteres(){
		return this.http.get(`${environment.urlFirebase}interested.json`);
	}


  checkIfDataExists(email: string): Observable<boolean> {
    const url = `${environment.urlFirebase}interested.json?orderBy="email"&equalTo="${email}"`;

    return this.http.get<any>(url).pipe(
      map(response => {
        // Verificar si hay datos en la respuesta
        const dataExists = Object.keys(response).length > 0;
        return dataExists;
      }),
      catchError(error => {
          return throwError('Error en la solicitud');
      })
    );
  }



	postData(data: Iinteres, token:any){

		return this.http.post(`${environment.urlFirebase}interested.json?auth=${token}`, data);

	}



  getFilterDataperm(orderBy:string, equalTo:string){

    return this.http.get(`${environment.urlFirebase}permissionsxcompanys.json?orderBy="${orderBy}"&equalTo="${equalTo}"`);

	}


  deleteInteres(id:string, token: any){

    return this.http.delete(`${environment.urlFirebase}interested/${id}.json?auth=${token}`);

	}


}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Ibranch } from '../interface/ibranch';

@Injectable({
  providedIn: 'root'
})
export class BranchsService {

  constructor(private http: HttpClient) { }

	/*=============================================
	Tomar la data de la colección Empresas en Firebase
	=============================================*/

    getData(){

        return this.http.get(`${environment.urlFirebase}branchs.json`);

    }

/*=============================================
	Tomar data filtrada de la colección branch en Firebase
	=============================================*/

	getFilterData(orderBy:string, equalTo:string){

		return this.http.get(`${environment.urlFirebase}branchs.json?orderBy="${orderBy}"&equalTo="${equalTo}
          "&print=pretty`);

	}

  /*=============================================
	Guardar información de la categoría
	=============================================*/

	postData(data: Ibranch, token:any){

		return this.http.post(`${environment.urlFirebase}branchs.json?auth=${token}`, data);

	}

  /*-------------------------
   Actualizar informacion
  --------------------------*/

  patchData(id:string, data:object, token:any){

		return this.http.patch(`${environment.urlFirebase}branchs/${id}.json?auth=${token}`, data);
    console.log("PATCH")
	}

  /*---------------------------------------------
    Tomar un item de la data branch en Firebase
   ---------------------------------------------*/

  getItem(id: string) {

		return this.http.get(`${environment.urlFirebase}branchs/${id}.json`);
 
	}

	 /*=============================================
	Eliminar categoría
	=============================================*/

	deleteData(id:string){

		return this.http.delete(`${environment.urlFirebase}branchs/${id}.json`);

	}

  }

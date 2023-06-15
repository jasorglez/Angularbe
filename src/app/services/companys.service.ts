import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Icompany } from '../interface/icompany';

import { map, tap, catchError, filter } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { alerts } from '../helpers/alerts';

@Injectable({
  providedIn: 'root'
})
export class CompanysService {

  private _idEmpresa : number ;



  constructor( private http: HttpClient ) {
    this._idEmpresa = 0 ;
   }


   /*-------------------------------
 * aqui obtengo el email del login y lo fijo
 ------------------------------*/


/*----------------------------------------------------------------------------------
 * Obtener la consulta por email para ver que empresas le corresponden al LookCombo
 ------------------------------------------------------------------------------------*/

getEmpresasxEmail(orderBy:string, equalTo:string){

 // return this.http.get(`${environment.urlFirebase}companyxusers.json?orderBy="email"&equalTo="jsoriano@hco-consultores.com"&print=pretty`);
  return this.http.get(`${environment.urlFirebase}companyxusers.json?orderBy="${orderBy}"&equalTo="${equalTo}"&print=pretty`);

}

   /*=============================================
	Tomar la data de la colección Empresas en Firebase
	=============================================*/
    getData(){

        return this.http.get(`${environment.urlFirebase}companys.json`);

    }

    getEmpresa(id: string): Observable<any> {

       return this.http.get(`${environment.urlFirebase}empresas/${id}.json`);

    }


    async addpermiscompany(company: string, email: string, id_company: string): Promise<void> {
      const data = {
        company,
        email,
        id_company
      };

      try {

        await this.http.post(`${environment.urlFirebase}permissionsxcompanys.json`, data).toPromise();

      } catch (error) {

        console.error('Error al crear el permiso de la empresa:', error);

        throw error; // Lanzar el error para manejarlo en la función llamadora si es necesario
      }
    }



getpermissionsxCompany(mail:string){
   return this.http.get(`${environment.urlFirebase}permissionsxcompanys.json?orderBy="email"&equalTo="${mail}"&print=pretty`);
 }

 getpermissionsxBranch(company:string){
  return this.http.get(`${environment.urlFirebase}permissionsxbranchs.json?orderBy="id_company"&equalTo="${company}"&print=pretty`);
}

getpermissionsxProject(branch:string){
  return this.http.get(`${environment.urlFirebase}permissionsxprojects.json?orderBy="id_branchs"&equalTo="${branch}"&print=pretty`);
}

postData(data: Icompany, token:any){
  try {
    return this.http.post(`${environment.urlFirebase}companys.json?auth=${token}`, data);

  }catch(error) {
  //  alerts.basicAlert("error", `Error save Users${error}`, "error")
    console.log("Error al grabar Companiaa", error)
    return null ;
  }

}

  }


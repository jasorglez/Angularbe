import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { alerts } from '../helpers/alerts';
import { map, tap, catchError, filter } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

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


    async addpermiscompany(email: string, id_company: string, id_branchs: string, id_projects: string) {

      const data = {
        email,
        id_company,
        id_branchs,
        id_projects
      };

      try {
        const response = await this.http.post(`${environment.urlFirebase}permissions.json`, data).toPromise();
        } catch (error) {
        console.error('Error al crear el permiso de la empresa:', error);
        alerts.basicAlert('error', "Error create permission for user/permission", "error")
      }
    }


    searchByEmailAndCompanyId(email: string, companyId: string) {
      const url =`${environment.urlFirebase}permissions.json?`;

      const params = new HttpParams()
        .set('orderBy', '"email"')
        .set('equalTo', `"${email}"`)
        .set('orderBy', '"id_company"')
        .set('equalTo', `"${companyId}"`);

      return this.http.get(url, { params });

    }


  }


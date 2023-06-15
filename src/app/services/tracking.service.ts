import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TrackingService {
  private emailser   : string = '' ;
  private nameser    : string = '' ;
  private pictureser  : string = '' ;

  public projectser  : string = '' ;
  public branchser   : string = '' ;
  public companyser  : string = '' ;

  setEmail(email: string): void {
    this.emailser = email;
  }

  setName(name: string): void {
    this.nameser = name;
  }

  setPicture(picture: string): void {
    this.pictureser = picture;
  }

  setProject(project: string) : void {
     this.projectser = project ;
  }

  setBranch(branch: string) : void {
     this.branchser = branch ;
  }

  setCompany(company : string) : void {
    this.companyser = company ;
  }

  getProject() {
    return this.projectser ;
  }

  getBranch() {
    return this.branchser ;
  }

  getCompany(){
    return this.companyser ;
  }

  getEmail(): string {
    return this.emailser;
  }

  getName():string {
    return this.nameser;
  }

  getPicture():string {
     return this.pictureser
  }

  constructor(private http: HttpClient) { }

  /*=============================================
	Guardar información de la
	=============================================*/

  async addLog(company: string, description: string, origin: string, user: string) {
    // Obtener la fecha actual
    const datetime = new Date();

    company = '' || 'SIN COMPANIA';

    if (!user) user = this.getEmail();

    const data = {
      company,
      datetime,
      origin,
      description,
      user,
      idn: 0,
    };

    try {
      const response: any = await this.http.get(`${environment.urlFirebase}tracking.json?orderBy="$key"&limitToLast=1`).toPromise();
      const lastLogId = Object.keys(response)[0]; // Obtener la clave del último registro
      const lastLog = response[lastLogId] as { idn: number }; // Obtener el último registro completo con la propiedad "id"

      // Asignar el valor de "id" del último registro al nuevo registro
      data['idn'] = lastLog ? lastLog.idn + 1 : 1;
      const postResponse = await this.http.post(`${environment.urlFirebase}tracking.json`, data).toPromise();
      // console.log('Log creado exitosamente:', postResponse);
    } catch (error) {
      console.error('Error al crear el log:', error);
    }
  }



  async addLog3(company: string, description: string, origin: string, user: string) {
    // Obtener la fecha actual
    const datetime = new Date();

    company = ''   || 'SIN COMPANIA' ;

    if (!user)  user = this.getEmail();

    const data = {
      company,
      datetime,
      origin,
      description,
      user
    };

    try {
      const response = await this.http.post(`${environment.urlFirebase}tracking.json`, data).toPromise();
     // console.log('Log creado exitosamente:', response);
    } catch (error) {
      console.error('Error al crear el log:', error);
    }
  }




	getDataTracking(valoruser :string){

    return this.http.get(`${environment.urlFirebase}tracking.json?orderBy="user"&equalTo="${valoruser}"&orderBy="$idn"&print=pretty&sortOrder="desc"`);

	}


  getTrackingRecordsByUser(user: string) {
    const url = `${environment.urlFirebase}tracking.json?orderBy="user"&equalTo="${user}"`;

    return this.http.get(url).pipe(
      map((response: any) => {
        // Filtrar los registros por el campo "user"
        const filteredRecords = Object.values(response).filter((record: any) => record.user === user);

        // Ordenar los registros por el campo "idn" en forma ascendente
        const sortedRecords = filteredRecords.sort((a: any, b: any) => a.idn - b.idn);

        // Invertir el orden de los registros para que los últimos aparezcan primero
        const reversedRecords = sortedRecords.reverse();

        return reversedRecords;

      })
    );
  }


  getTrackingRecordsByUser3(user: string) {
    const url = `${environment.urlFirebase}tracking.json`;

    return this.http.get(url).pipe(
      map((response: any) => {
        // Obtener las claves de los registros
        const keys = Object.keys(response);

        // Ordenar las claves en forma descendente
        const sortedKeys = keys.sort((a: any, b: any) => b.localeCompare(a));

        // Filtrar los registros por el campo "user"
        const filteredRecords = sortedKeys.map(key => response[key])
          .filter((record: any) => record.user === user);

        return filteredRecords;
      })
    );
  }



}






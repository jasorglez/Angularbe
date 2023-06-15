import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Iproject } from '../interface/iproject';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

constructor(private http:HttpClient ) { }



getDataprojects(equalTo:string){
  try {

    return this.http.get(`${environment.urlFirebase}projects.json?orderBy="id_branch"&equalTo="${equalTo}"`);
  }catch(error){
    console.log(error)
    return null
  }

}



postData(data: Iproject, token:any){
  try {
    return this.http.post(`${environment.urlFirebase}projects.json?auth=${token}`, data);

  }catch(error) {
  //  alerts.basicAlert("error", `Error save Users${error}`, "error")
    console.log("Error al grabar Companiaa", error)
    return null ;
  }
}


deleteProjects(id:string, token: any){
  try {
   return this.http.delete(`${environment.urlFirebase}projects/${id}.json?auth=${token}`);
  }catch(error) {
     console.log(error)
     return null ;
  }

 }


 async addpermisProject(projects: string, id_projects: string, id_branchs: string): Promise<void> {
  const datapro = {
    projects,
    id_projects,
    id_branchs
  };

  try {

    await this.http.post(`${environment.urlFirebase}permissionsxprojects.json`, datapro).toPromise();

  } catch (error) {

    console.error('Error for create the permission of the Branch:', error);

    throw error; // Lanzar el error para manejarlo en la función llamadora si es necesario
  }
}



}

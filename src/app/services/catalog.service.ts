import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { alerts } from 'src/app/helpers/alerts';

@Injectable({
  providedIn: 'root'
})
export class CatalogService {

  constructor( public http:HttpClient) { }


	getdataOrganization(){

    try {
      return this.http.get(`${environment.urlFirebase}organizations.json?`);
    }catch (error) {
       alerts.basicAlert('error', "Error query organizations in catalog service", "error" );
       return null;
    }

	}

  getdataStates(){
    try {
      return this.http.get(`${environment.urlFirebase}states.json?`);
    }catch(error)
    {
      alerts.basicAlert('error', "Error query states in catalog service", "error");
      return null;
    }
  }

    getdataMeasures(){
      try {
        //return this.http.get(`${environment.urlFirebase}states.json?`);
        return this.http.get(`${environment.urlAzure}api/Catalogo/Measure`);
      }catch(error)
      {
        alerts.basicAlert('error', "Error query Measures in catalog service", "error");
        return null;
      }

	}


  getdataFamilys(){
    try {
      return this.http.get(`${environment.urlAzure}api/Catalogo/Family`);
    }catch(error)
    {
      alerts.basicAlert('error', "Error query Familys in catalog service", "error");
      return null;
    }
}


getdataUbications(){
  try {
    return this.http.get(`${environment.urlAzure}api/Catalogo/Ubication`);
  }catch(error)
  {
    alerts.basicAlert('error', "Error query Ubications in catalog service", "error");
    return null;
  }

}

getdataDirections(company : string){
  try {
    return this.http.get(`${environment.urlAzure}api/Catalogo/directions?idCompany=${company}`);
  }catch(error)
  {
    alerts.basicAlert('error', "Error query Directions in catalog service", "error");
    return null;
  }

}

getPermissionxArea(id : number, ban: number) {
  try {
   // return this.http.get(`${environment.urlAzure}api/Area?id=${id}`);

   if (ban==0)
   {
    return this.http.get(`${environment.urlAzure}api/Area?id=${id}`);
   }
   else
    return this.http.get(`${environment.urlAzure}api/Area/dir?id=${id}`);


  }catch(error)
  {
    alerts.basicAlert('error', "Error query Area in catalog service", "error");
    return null;
  }
}

}

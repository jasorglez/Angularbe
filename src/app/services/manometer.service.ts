import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ManometerService {

constructor(private http : HttpClient) { }

getManometer(plat: string) {
  try {
    const apiUrl = `${environment.urlAzure}api/Manometer?platform=${plat}`;
    return this.http.get(apiUrl)
  }catch(error){
  console.error("Error Psv", error) ;
  return null ;
  }
}

}

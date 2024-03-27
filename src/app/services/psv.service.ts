import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PsvService {

constructor(private http : HttpClient) { }

getPsv(plat: string) {
  try {
    const apiUrl = `${environment.urlAzure}api/Psv?platform=${plat}`;
    return this.http.get(apiUrl)
  }catch(error){
  console.error("Error Psv", error) ;
  return null ;
  }
}


}

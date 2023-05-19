import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InteresService {

  constructor( public http:HttpClient) { }


	getDataInteres(){
		return this.http.get(`${environment.urlFirebase}interested.json`);
	}

}

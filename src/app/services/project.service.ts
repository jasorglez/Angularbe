import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

constructor(private http:HttpClient ) { }

getDataprojects(){
  		return this.http.get(`${environment.urlFirebase}projects.json`);
}

}

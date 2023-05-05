import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Iusers } from '../interface/iusers';

import  axios  from 'axios';

import { map, tap, catchError, filter } from 'rxjs/operators';
import { forkJoin, Observable, of, throwError } from 'rxjs';

import { getDatabase, startAt, endAt, ref, child, query, orderByChild, equalTo, get,
    DataSnapshot, limitToFirst, onValue, onChildAdded } from 'firebase/database';

import { app, db } from 'src/app/firebase.config';

import 'firebase/compat/database';


@Injectable({
  providedIn: 'root'
})
export class UsersService {

constructor(private http:HttpClient ) { }



  ///*** aqui empieza el codigo */

  public async getEvents() {
    try {
      //const response = await axios.get(`${environment.urlFirebase}events.json?orderBy="name"&equalTo="${eventName}"`);
      const response = await axios.get(`${environment.urlFirebase}events.json`);
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }


  public async getEventAttendees(eventId: string) {
    try {
      const response = await axios.get(`${environment.urlFirebase}eventAttendees/${eventId}.json`);
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  public async getEventData(eventId: string) {
    try {
      const response = await axios.get(`${environment.urlFirebase}events/${eventId}.json`);
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  public async getUserData(userId: string) {
    try {
      const response = await axios.get(`${environment.urlFirebase}users/${userId}.json`);
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }


  public async getUserEventData() {
    const events = await this.getEvents();

    const result = await Promise.all(Object.keys(events).map(async (eventId) => {
      const eventAttendees = await this.getEventAttendees(eventId);
      if (eventAttendees !== null) {
        const attendees = await Promise.all(Object.keys(eventAttendees).map(async (attendeeId) => {
          const userData = await this.getUserData(attendeeId);
          const eventData = await this.getEventData(eventId);
          if (eventData && userData) {
            return {
              name: eventData.name,
              organization: userData.organization,
              displayName: userData.displayName,
            };
          } else {
            return null;
          }
        }));
        return attendees;
      } else {
        return null;
      }
    }));

    const flattenedResult = result.flat().filter(Boolean);
    console.log('Join Final', flattenedResult);
    return flattenedResult;
  }



 /* public async getUserEventData(eventName: string) {
     const events = await this.getEvents(eventName);
     console.log('Las cias',events);

     const result = [];
     let event: string;

      for (const eventId in events) {
             const even = eventId;

         const eventAttendees = await this.getEventAttendees(even);
          if (eventAttendees !== null) {
             console.log('eventsAttendees Perra', eventAttendees)
             event = even;

             for (const asisId in eventAttendees ) {
               const asis = asisId ;

                    const userData = await this.getUserData(asis);
                    const eventData = await this.getEventData(event);
                      if (eventData) {
                              const userEventData = {
                                name: eventData.name,
                                organization: userData.organization,
                                displayName: userData.displayName,
                              };
                              result.push(userEventData);
                              console.log('Join Final', result);
                              eventAttendees.next ;
                      }
          }
        }
         events.next ;
      }
        console.log('Join Final', result);
        return result;
  }
*/


  ///***termina el codigo */





  /*=============================================
	Tomar la data de la colección usuarios en Firebase
	=============================================*/

  getCompaniesWithPermission(email: string): Observable<any> {

    return this.http.get<any>(`${environment.urlFirebase}prueba.json?orderBy="permisosxemail/${email}"&equalTo=true`);
  }


  //  return this.http.get<any>(`${this.url}?orderBy="permissions/${email}"&equalTo=true`);


	getData(){

		return this.http.get(`${environment.urlFirebase}users.json`);
	}


  getCompaniesByPermission(email: string): Observable<any> {
    const url = `${environment.urlFirebase}permissions.json?orderBy="email"&equalTo="${email}"&print=pretty`;

    return this.http.get(url).pipe(
      map(data => {
        const permissions = Object.values(data);
        if (permissions.length === 0) {
          throw new Error('No se encontraron permisos para el correo electrónico proporcionado.');
        }
        const companies = permissions.map(permission => permission.id_company);
        return [...new Set(companies)];
      }),
      catchError(err => {
        console.log(err);
        return throwError(err);
      })
    );
  }


}

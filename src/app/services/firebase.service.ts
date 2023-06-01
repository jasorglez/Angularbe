import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { Observable, map, take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { app, db } from 'src/app/firebase.config';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private db: AngularFireDatabase) { }


  getpermxCompany2(idcomp: string, mail: string): Observable<boolean> {
    const usersRef: AngularFireList<any> = this.db.list('permissionsxcompanys');
    return usersRef.valueChanges().pipe(
      map(pc => pc.filter(pc => pc.email === mail && pc.id_company === idcomp)),
      map(filteredPc => filteredPc.length > 0)
    );
  }

  async getpermxCompany(idcomp: string, mail: string): Promise<boolean> {
    const usersRef: AngularFireList<any> = this.db.list('permissionsxcompanys');

    try {
      const pc = await usersRef.valueChanges().pipe(take(1)).toPromise();
      const filteredPc = pc.filter(pc => pc.email === mail && pc.id_company === idcomp);
      return filteredPc.length > 0;
    } catch (error) {
      console.error('Error al obtener los permisos de la empresa:', error);
      throw error;
    }
  }

}

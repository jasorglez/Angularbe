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



  async getpermxCompany(idcomp: string, mail: string): Promise<boolean> {
    const permissRef: AngularFireList<any> = this.db.list('permissionsxcompanys');

    try {
      const pc = await permissRef.valueChanges().pipe(take(1)).toPromise();
      const filteredPc = pc.filter(pc => pc.email === mail && pc.id_company === idcomp);
      return filteredPc.length > 0;
    } catch (error) {
      console.error('Error al obtener los permisos de la empresa:', error);
      throw error;
    }
  }

  async getpermxBranch(idcomp: string, mail: string): Promise<boolean> {
    const permissRef: AngularFireList<any> = this.db.list('permissionsxbranchs');

    try {
      const pc = await permissRef.valueChanges().pipe(take(1)).toPromise();
      const filteredPc = pc.filter(pc => pc.email === mail && pc.id_company === idcomp);
      return filteredPc.length > 0;
    } catch (error) {
      console.error('Error al obtener los permisos de la empresa:', error);
      throw error;
    }
  }

  async getpermxProjecty(idcomp: string, mail: string): Promise<boolean> {
    const permissRef: AngularFireList<any> = this.db.list('permissionsxprojects');

    try {
      const pc = await permissRef.valueChanges().pipe(take(1)).toPromise();
      const filteredPc = pc.filter(pc => pc.email === mail && pc.id_company === idcomp);
      return filteredPc.length > 0;
    } catch (error) {
      console.error('Error al obtener los permisos de la empresa:', error);
      throw error;
    }
  }

}

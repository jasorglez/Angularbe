import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { take } from 'rxjs';

//import { app, db } from 'src/app/firebase.config';

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


  async getpermxBranch(idbranch: string, id_company: string): Promise<boolean> {
    const permissRef: AngularFireList<any> = this.db.list('permissionsxbranchs');

    try {

      const pc = await permissRef.valueChanges().pipe(take(1)).toPromise();
      const filteredPc = pc.filter(pc => pc.id_branchs === idbranch && pc.id_company === id_company);
      return filteredPc.length > 0;

    } catch (error) {

      console.error('Error get permission of the Branchs', error);
      throw error;

    }
  }

  async getpermxProject(idproject: string, id_branch: string): Promise<boolean> {
    const permissRef: AngularFireList<any> = this.db.list('permissionsxprojects');

    try {
      const pc = await permissRef.valueChanges().pipe(take(1)).toPromise();
      const filteredPc = pc.filter(pc => pc.id_projects === idproject && pc.id_branchs === id_branch);
      return filteredPc.length > 0;
    } catch (error) {
      console.error('Error al obtener los permisos de la empresa:', error);
      throw error;
    }
  }


  async deleteCompanys(idcomp: string, mail: string): Promise<void> {
    const permissRef: AngularFireList<any> = this.db.list('permissionsxcompanys');

    try {
      const pc = await permissRef.snapshotChanges().pipe(take(1)).toPromise();
      const filteredPc = pc.filter(pc => pc.payload.val().email === mail && pc.payload.val().id_company === idcomp);

      if (filteredPc.length > 0) {
        await permissRef.remove(filteredPc[0].key);
      //  console.log('Registro eliminado con éxito');
      }

      else {
        console.log('No se encontró ningún registro que coincida con las condiciones');
      }

    } catch (error) {
      console.error('Error al eliminar el registro:', error);
      throw error;
    }
  }


  
  async deleteBranchs(idcomp: string, id: string): Promise<void> {
    const permissRef: AngularFireList<any> = this.db.list('permissionsxbranchs');

    try {
      const pc = await permissRef.snapshotChanges().pipe(take(1)).toPromise();
      const filteredPc = pc.filter(pc => pc.payload.val().id_branchs === id && pc.payload.val().id_company === idcomp);

      if (filteredPc.length > 0) {
        await permissRef.remove(filteredPc[0].key);
      }

      else {
        console.log('No se encontró ningún registro que coincida con las condiciones');
      }

    } catch (error) {
      console.error('Error al eliminar el registro:', error);
      throw error;
    }
  }


  async deleteProjects(idbranch: string, id: string): Promise<void> {
    const permissRef: AngularFireList<any> = this.db.list('permissionsxprojects');

    try {
      const pc = await permissRef.snapshotChanges().pipe(take(1)).toPromise();
      const filteredPc = pc.filter(pc => pc.payload.val().id_projects === id && pc.payload.val().id_branch === idbranch);

      if (filteredPc.length > 0) {
        await permissRef.remove(filteredPc[0].key);
      }

      else {
        console.log('No se encontró ningún registro que coincida con las condiciones');
      }

    } catch (error) {
      console.error('Error al eliminar el registro:', error);
      throw error;
    }
  }

}

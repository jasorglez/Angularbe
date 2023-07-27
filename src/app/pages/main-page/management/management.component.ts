import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { TrackingService } from 'src/app/services/tracking.service';

import { Imanagement } from 'src/app/interface/imanagement';
import { Imanfildet } from 'src/app/interface/imanfildet';
import { MatTableDataSource } from '@angular/material/table';
import { ManagementService } from 'src/app/services/management.service';

import { MatPaginator} from '@angular/material/paginator';
import { MatSort} from '@angular/material/sort';

import { functions } from 'src/app/helpers/functions';

import { alerts } from 'src/app/helpers/alerts';

import { TraductorService} from 'src/app/services/traductor.service';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NewFileComponent } from './newFile/newFile.component';
import { EditFileComponent } from './editFile/editFile.component';
import { profile } from 'console';


@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.css']
})
export class ManagementComponent {

  selectedTab = 'management';
  currentIndex : number = 0 ;

  onTabSelected(tabName: string) {
    this.selectedTab = tabName;

    if (tabName === 'details') {
      this.trackingService.addLog(
        '',
        'Click en la Pestaña Documents del menu Gestion de Proyectos',
        'Proyectos',
        ''

      );

      this.getDatadetails()
    }

  }


   /*=============================================
 Variable para nombrar las columnas de nuestra tabla en Angular Material
 =============================================*/
 displayedColManag   : string[] = ['numberposition', 'name','actions'];

 displayedColdetails : string[] = ['numberposition', 'name','date', 'parent',
                                   'url', 'version', 'actions'];

 /*=============================================
   Variable global que instancie la data que aparecerá en la Tabla
 =============================================*/
 managDataSource!    :MatTableDataSource<Imanagement>;
 detailsDataSource!  :MatTableDataSource<Imanfildet>;

 /*=============================================
   Variable global que tipifica la interfaz de usuario
 =============================================*/

 management : Imanagement[] = [] ;
 manfildet  : Imanfildet[]  = [] ;

 profile : any = {};

 screenSizeSM = false;

 /*=============================================
 Variable global para saber cuando finaliza la carga de los datos
 =============================================*/
 loadData  = false;


 @ViewChild(MatPaginator) paginator!: MatPaginator;
 @ViewChild(MatSort) sort!: MatSort;


 constructor(public translateService: TraductorService,
             private trackingService : TrackingService,
             private managementService : ManagementService,
             public dialog : MatDialog,) { }


ngOnInit(): void {
  //Called after the constructor, initializing input properties, and the first call to ngOnChanges.


  this.getManagement();


}

   // Función para mostrar el perfil de un usuario
   showProfile(manag: Imanagement) {
    // Actualizamos el currentIndex y el profile
    // console.log(`Nombre: ${user.displayName}, Email: ${user.email}, Edad: ${user.age}`);
    this.profile = manag;
 }


 getManagement(){

    this.loadData = true;

    this.managementService.getDatamanagement(localStorage.getItem('project') )
      .subscribe((resp: any) => {
        /*=============================================
      Integrando respuesta de base de datos con la interfaz
      =============================================*/
        let numberposition = 1;

        this.management = Object.keys(resp).map(
          (a) =>
            ({
              id: a,
              numberposition : numberposition++,
              active         : resp[a].active,
              titulo         : resp[a].titulo,
              orden          : resp[a].orden,
              id_project     : resp[a].id_project
            } as Imanagement)
        );

       // console.log(this.comunications)
         this.profile = this.management[this.currentIndex]; // Tomamos el primer registro
         this.managDataSource = new MatTableDataSource(this.management); // Creamos el dataSource
         this.managDataSource.paginator = this.paginator;
         this.managDataSource.sort = this.sort;
         this.loadData = false;

      });

 }

 getDatadetails() {

  this.loadData = true;

  this.managementService.getManfildet(this.profile.id)
    .subscribe((resp: any) => {
      /*=============================================
    Integrando respuesta de base de datos con la interfaz
    =============================================*/
      let numberposition = 1;

      this.manfildet = Object.keys(resp).map(
        (a) =>
          ({
            id: a,
            numberposition : numberposition++,
            date           : resp[a].date,
            description    : resp[a].description,
            id_manage      : resp[a].id_manage,
            name           : resp[a].name,
            parent         : resp[a].parent,
            version        : resp[a].version,
            url            : resp[a].url
          } as Imanfildet)
      );

     // console.log(this.manfildet)
       //this.profile = this.management[this.currentIndex]; // Tomamos el primer registro
       this.detailsDataSource = new MatTableDataSource(this.manfildet); // Creamos el dataSource
       this.detailsDataSource.paginator = this.paginator;
       this.detailsDataSource.sort = this.sort;
       this.loadData = false;
    });

 }

newManagDet(id: string) {

  const dialogRef = this.dialog.open(NewFileComponent, {
    data: {
      profileId: this.profile.id
    }
  });

  /*-------------------------------------
    Actualizar el listado de la tabla
   -------------------------------------*/
  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      alerts.confirmAlert('Se realizo el registro correctamente', 'Register new Ok', 'success', 'Ok').then((result) => {
        this.getDatadetails() ;
      });
    }
  })
}





deleteMan( id: string){

  alerts.confirmAlert('Are you sure?', 'The information cannot be recovered!', 'warning','Yes, delete it!')
  .then((result) => {

if (result.isConfirmed) {
      this.managementService.findSubdetails(id).

        subscribe(

           (resp:any) => {

            if (Object.keys(resp).length > 0) {
                  alerts.basicAlert('error', "The communication has related permission", "error")
            } else {

              this.managementService.deleteManage(id, localStorage.getItem('token'))

              .subscribe(
                () => {

                    alerts.basicAlert("Sucess", "The Management has been deleted", "success")

                    this.getManagement();
                }
              )
            }

         }
     )
}
})

}


editManag(id : string) {

  const dialogRef = this.dialog.open(EditFileComponent,{

    width:'45%',
    data: { id: id,
            profileId : this.profile.id	}

  })

  /*=============================================
  Actualizar el listado de la tabla
  =============================================*/

  dialogRef.afterClosed().subscribe(result =>{

    if(result){

      this.getDatadetails();

    }

  })

}

applyFilter(dataSource: MatTableDataSource<any>, event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  dataSource.filter = filterValue.trim().toLowerCase();

  if (dataSource.paginator) {
    dataSource.paginator.firstPage();
  }
}


openLink(url: string) {
  // este es el ultimo cambio que subi
  window.open(url, '_blank');
}



  }

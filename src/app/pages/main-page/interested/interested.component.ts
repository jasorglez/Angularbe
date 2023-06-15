import { Component, OnInit, ViewChild } from '@angular/core';

import { Iinteres } from 'src/app/interface/interested';

import { TraductorService} from 'src/app/services/traductor.service';
import { TrackingService } from 'src/app/services/tracking.service';

import { MatTableDataSource } from '@angular/material/table';
import { InteresService } from 'src/app/services/interes.service';

import { MatPaginator} from '@angular/material/paginator';
import { MatSort} from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';

import { NewInterestedComponent } from './newInterested/newInterested.component';
import { EditInterestedComponent } from './editInterested/editInterested.component';

import { functions } from 'src/app/helpers/functions';

import { alerts } from 'src/app/helpers/alerts';

@Component({
  selector: 'app-interested',
  templateUrl: './interested.component.html',
  styleUrls: ['./interested.component.css']
})
export class InterestedComponent implements OnInit{

   selectedTab = 'interested';
   currentIndex : number = 0 ;

   onTabSelected(tabName: string) {
    this.selectedTab = tabName;

    if (tabName=== 'interested') {
        this.trackingService.addLog('', 'Click en la Pestaña Interested/Interesados del menu Interesados', 'PMO', '')}

  }

  	/*=============================================
	Variable para nombrar las columnas de nuestra tabla en Angular Material
	=============================================*/
  displayedColInteres: string[] = ['numberposition', 'email','actions'];

  /*=============================================
  	Variable global que instancie la data que aparecerá en la Tabla
	=============================================*/
	interesDataSource!    :MatTableDataSource<Iinteres>;

  /*=============================================
	  Variable global que tipifica la interfaz de usuario
	=============================================*/

  interes : Iinteres[]   = [];

  profile : any = {};

	/*=============================================
	Variable global para definir tamaños de pantalla
	=============================================*/

	screenSizeSM = false;

  /*=============================================
	Variable global para saber cuando finaliza la carga de los datos
	=============================================*/
	loadData  = false;


  @ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;


  constructor(public translateService: TraductorService, private trackingService : TrackingService,
              private interesService : InteresService,
               public dialog : MatDialog,) { }

  ngOnInit(): void {

    this.getdataIntere();

    	/*=============================================
    		Definir tamaños de pantalla
    		=============================================*/

    		if(functions.screenSize(0, 767)){

    			this.screenSizeSM = true;

    		}else{

    			this.screenSizeSM = false;
    			this.displayedColInteres.splice(1, 0, 'displayName');
    			this.displayedColInteres.splice(2, 0, 'position');
          this.displayedColInteres.splice(3, 0, 'phone');

    		}


  }


   // Función para mostrar el perfil de un usuario
   showProfile(user: Iinteres) {
       // Actualizamos el currentIndex y el profile
       // console.log(`Nombre: ${user.displayName}, Email: ${user.email}, Edad: ${user.age}`);
       this.profile = user;
    }


    getdataIntere(){

      this.loadData = true;

      this.interesService.getDataInteres().subscribe((resp:any)=>{

        /*=============================================
      Integrando respuesta de base de datos con la interfaz
      =============================================*/
        let numberposition = 1;

        this.interes = Object.keys(resp).map(a=> ({

          id:a,
          numberposition:numberposition++,
          active:resp[a].active,
          avg:resp[a].avg,
          branch:resp[a].branch,
          company:resp[a].company,
          email:resp[a].email,
          follow:resp[a].follow,
          idinter:resp[a].idinter,
          interes:resp[a].interes,
          influence:resp[a].influence,
          name:resp[a].name,
          phone:resp[a].phone,
          picture:resp[a].picture,
          position:resp[a].position,
          project:resp[a].project,
          power:resp[a].power,
          organization:resp[a].organization,
          role:resp[a].role,

        } as Iinteres ));

            // Tomamos el primer registro
        this.profile = this.interes[this.currentIndex];

        //console.log("this.profile", this.profile);

        // Creamos el dataSource
        this.interesDataSource = new MatTableDataSource(this.interes);
        this.interesDataSource.paginator = this.paginator;
        this.interesDataSource.sort = this.sort;
        this.loadData = false;

      })

     }



    newInteres() {

      const dialogRef= this.dialog.open(NewInterestedComponent);

        /*-------------------------------------
          Actualizar el listado de la tabla
         -------------------------------------*/

         dialogRef.afterClosed().subscribe(result => {
           if (result) {

            //alerts.basicAlert("Ok", 'The User has been saved', "success");
             alerts.confirmAlert('Se realizo el registro correctamente', 'Se ha agregado un nuevo interesado', 'success', 'Ok').then((result) => {

               this.getdataIntere();
             });

           }
         })

    }


    editInteres(id:string) {
      const dialogRef = this.dialog.open(EditInterestedComponent, {
        data: { id: id }
      })

      /*=============================================
      Actualizar el listado de la tabla
      =============================================*/

      dialogRef.afterClosed().subscribe(result => {

        if (result) {

          this.getdataIntere();

        }

      })
    }


    deleteInteres(id:string, mail: string) {


     alerts.confirmAlert('Are you sure?', 'The information cannot be recovered!', 'warning','Yes, delete it!')
     .then((result) => {

       if (result.isConfirmed) {
             this.interesService.getFilterDataperm("email", mail).

               subscribe(

                  (resp:any) => {

                   if (Object.keys(resp).length > 0) {
                         alerts.basicAlert('error', "The category has related permission", "error")
                   } else {

                     this.interesService.deleteInteres(id, localStorage.getItem('token'))

                     .subscribe(
                       () => {

                           alerts.basicAlert("Sucess", "The user has been deleted", "success")

                           this.getdataIntere();
                       }
                     )
                   }

                 }

              )
       }
     })

    }


 	/*=============================================
	Filtro de Búsqueda
	=============================================*/
  applyFilter(dataSource: MatTableDataSource<any>, event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    dataSource.filter = filterValue.trim().toLowerCase();

    if (dataSource.paginator) {
      dataSource.paginator.firstPage();
    }
  }

}

import { Component, OnInit, ViewChild } from '@angular/core';

import { TraductorService} from 'src/app/services/traductor.service';
import { TrackingService } from 'src/app/services/tracking.service';
import { CommunicationsService } from 'src/app/services/communications.service';

import { Icommunications } from 'src/app/interface/icommunication';
import { functions } from 'src/app/helpers/functions';

import { alerts } from 'src/app/helpers/alerts';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator} from '@angular/material/paginator';
import { MatSort} from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-communications',
  templateUrl: './communications.component.html',
  styleUrls: ['./communications.component.css']
})

export class CommunicationsComponent {

   selectedTab = 'communications';
   currentIndex : number = 0 ;

    onTabSelected(tabName: string) {
      this.selectedTab = tabName;

    if (tabName=== 'communications') {
            this.trackingService.addLog('', 'Click en la Pestaña Communications del menu Communications', 'PMO', '')}
  }

  communicationsDataSource!  : MatTableDataSource<Icommunications>;
  communications : Icommunications[] = [] ;
  profile : any = {};

  screenSizeSM = false;

	loadData  = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;

  displayedColcommunication: string[] = ['numberposition', 'proccess', 'information','owner', 'actions'];

  communDataSource!    :MatTableDataSource<Icommunications>;

  constructor (public translateService: TraductorService, private trackingService : TrackingService,
               private communicationsService: CommunicationsService ) {}

  ngOnInit(): void {

    this.getdataCommunic();

    	/*=============================================
    		Definir tamaños de pantalla
    		=============================================

    		if(functions.screenSize(0, 767)){

    			this.screenSizeSM = true;

    		}else{

    			this.screenSizeSM = false;
    			this.displayedColInteres.splice(1, 0, 'area');
    			this.displayedColInteres.splice(2, 0, 'group');

    		}*/


  }


  // Función para mostrar el perfil de un usuario
  showProfile(commun: Icommunications) {
    // Actualizamos el currentIndex y el profile
    // console.log(`Nombre: ${user.displayName}, Email: ${user.email}, Edad: ${user.age}`);
    this.profile = commun;
 }


 getdataCommunic(){

   this.loadData = true;

   this.communicationsService.getDataCommunications().subscribe((resp:any)=>{

    console.log(resp);
     /*=============================================
   Integrando respuesta de base de datos con la interfaz
   =============================================*/
     let numberposition = 1;

     this.communications = Object.keys(resp).map(a=> ({

       id:a,
       numberposition :numberposition++,
       active         : resp[a].active,
       name           : resp[a].name,
       procces        : resp[a].procces,
       information    : resp[a].information,
       format         : resp[a].formaty,
       area           : resp[a].area,
       owner          : resp[a].owner,
       reference      : resp[a].reference,
       frequence      : resp[a].frequence,
       group          : resp[a].group,
       id_interested  : resp[a].id_interested,
     } as Icommunications ));

         // Tomamos el primer registro
     this.profile = this.communications[this.currentIndex];

     //console.log("this.profile", this.profile);

     // Creamos el dataSource
     this.communDataSource = new MatTableDataSource(this.communications);
     this.communDataSource.paginator = this.paginator;
     this.communDataSource.sort = this.sort;
     this.loadData = false;

   })

  }


  applyFilter(dataSource: MatTableDataSource<any>, event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    dataSource.filter = filterValue.trim().toLowerCase();

    if (dataSource.paginator) {
      dataSource.paginator.firstPage();
    }
  }


  newCommunications() {

  }

  editCommunic(id: string) {

  }

  deleteCommunic(id: string) {

    alerts.confirmAlert('Are you sure?', 'The information cannot be recovered!', 'warning','Yes, delete it!')
     .then((result) => {
      if (result.isConfirmed) {

                     this.communicationsService.deleteCommunications(id, localStorage.getItem('token'))
                     .subscribe(
                       () => {

                           alerts.basicAlert("Sucess", "The user has been deleted", "success")

                           this.getdataCommunic();
                       })
                   }
                  }
              )
       }




}






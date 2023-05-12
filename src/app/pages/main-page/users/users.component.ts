import { Component, OnInit, ViewChild } from '@angular/core';

import { Iusers } from 'src/app/interface/iusers';
import { Ilog } from 'src/app/interface/ilog';
import { Icompany } from 'src/app/interface/icompany';
import { Ibranch } from 'src/app/interface/ibranch';
import { Iproject } from 'src/app/interface/iproject';

import { UsersService } from 'src/app/services/users.service';
import { CompanysService } from 'src/app/services/companys.service';
import { BranchsService } from 'src/app/services/branchs.service';
import { ProjectService } from 'src/app/services/project.service';
import { TrackingService } from 'src/app/services/tracking.service';
import { TraductorService} from 'src/app/services/traductor.service';

import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';

import {animate, state, style, transition, trigger} from '@angular/animations';

import { environment } from 'src/environments/environment';
import { functions } from 'src/app/helpers/functions';

import { db } from 'src/app/firebase.config';
import { ref, get, onValue} from 'firebase/database';


@Component({
	selector: 'app-users',
	templateUrl: './users.component.html',
	styleUrls: ['./users.component.css'],

    animations: [
	    trigger('detailExpand', [
	      state('collapsed, void', style({height: '0px', minHeight: '0', display: 'none'})),
	      state('expanded', style({height: '*'})),
	      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
	      transition('expanded <=> void', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
	    ])
  	]

})
export class UsersComponent implements OnInit {


  userEvents: any[] = [];
  currentIndex : number = 0 ;

  selectedTab = 'users';

onTabSelected(tabName: string) {
  this.selectedTab = tabName;

  if (tabName=== 'users') {
      this.trackingService.addLog('', 'Click en la Pestaña Users/Usuarios del menu Usuarios', 'Usuarios', '')}

  if (tabName=== 'companys') {
      this.trackingService.addLog('', 'Click en la Pestaña Company/Empresas del menu Usuarios', 'Usuarios', '')
      this.getdataCompany() }

  if (tabName=== 'branchs') {
      this.trackingService.addLog('', 'Click en la Pestaña Branchs/Sucursales del menu Usuarios', 'Usuarios', '')
      this.getdataBranchs() }

  if (tabName=== 'projects') {
      this.trackingService.addLog('', 'Click en la Pestaña Projects/Proyectos del menu Usuarios', 'Usuarios', '')
      this.getdataProject() }

  if (tabName=== 'settings') {
      this.trackingService.addLog('', 'Click en la Pestaña Settings/Seguimiento del menu Usuarios', 'Usuarios', '')
      this.getdataTracking() }

}
 /*=============================================
	Creamos grupo de controles
	=============================================*/

	public myform = this.form.group({

		email: ['', [Validators.required, Validators.email]],
		password: ['', Validators.required]
	})


	/*=============================================
	Variable para nombrar las columnas de nuestra tabla en Angular Material
	=============================================*/
	 displayedColUsers: string[] = [  'numberposition',
				'email', 'actions'];

   displayedColCompany: string[] = [  'numberposition',
					'displayName', 'rfc',
 					'address', 'actions'
        ];

    displayedColBranchs: string[] = [  'position',
        'name', 'street', 'country' ,'actions' ];

    displayedColProject: string[] = [  'position',
        'contract', 'description', 'tender' ,'actions' ];

    displayedColTracking: string[] = [  'numberposition',
				'user', 'date','description',
				'origin', 'idn'];


 selectedColor = 'primary'; // Inicialmente, el color seleccionado es 'primary'

	/*=============================================
	Variable global que instancie la data que aparecerá en la Tabla
	=============================================*/
	UsersDataSource!    :MatTableDataSource<Iusers>;
  companyDataSource!  : MatTableDataSource<Icompany>;
  branchsDataSource!  : MatTableDataSource<Ibranch> ;
  projectsDataSource! : MatTableDataSource<Iproject>;
  trackingDataSource! : MatTableDataSource<Ilog>;

	/*=============================================
	Variable global que tipifica la interfaz de usuario
	=============================================*/

	  users   : Iusers[]   = [];
    company : Icompany[] = [];
    log     : Ilog[]     = [];
    branch  : Ibranch[]  = [];
    project : Iproject[] = [];
    profile : any = {};

	/*=============================================
	Variable global que informa a la vista cuando hay una expansión de la tabla
	=============================================*/

	//expandedElement!: Iusers | null;


	/*=============================================
	Variable global que captura la ruta de los archivos de imagen
	=============================================*/

	path = environment.urlFiles;

	/*=============================================
	Variable global para definir tamaños de pantalla
	=============================================*/

	screenSizeSM = false;

	/*=============================================
	Variable global para saber cuando finaliza la carga de los datos
	=============================================*/
	loadData  = false;
  loadData2 = false;
  loadData3 = false;
  loadData4 = false;
  loadData5 = false;
	/*=============================================
	Paginación y orden
	=============================================*/

	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;


  	constructor(public translateService: TraductorService, private usersService: UsersService, private companyService: CompanysService,
        private branchService: BranchsService, private projectsService: ProjectService, private trackingService : TrackingService,
        private form:FormBuilder) {   }

  	ngOnInit(): void {

  		this.getdataUsers();


      	/*=============================================
    		Definir tamaños de pantalla
    		=============================================*/

    		if(functions.screenSize(0, 767)){

    			this.screenSizeSM = true;

    		}else{

    			this.screenSizeSM = false;

    			this.displayedColUsers.splice(1, 0, 'displayName');
    			this.displayedColUsers.splice(2, 0, 'position');

    		}

 	}


	/*=============================================
	función para tomar la data de usuarios
	=============================================*/

       // Función para mostrar el perfil de un usuario
      showProfile(user: Iusers) {
         // Actualizamos el currentIndex y el profile
         // console.log(`Nombre: ${user.displayName}, Email: ${user.email}, Edad: ${user.age}`);
        this.profile = user;
       }

      getdataUsers(){

  		this.loadData = true;

  		this.usersService.getDataUsers().subscribe((resp:any)=>{

  			/*=============================================
			Integrando respuesta de base de datos con la interfaz
			=============================================*/
  			let numberposition = 1;

  			this.users = Object.keys(resp).map(a=> ({

  				id:a,
  				numberposition:numberposition++,
          active:resp[a].active,
          age:resp[a].age,
  			  country:resp[a].country,
				  displayName:resp[a].displayName,
				  email:resp[a].email,
          iduser:resp[a].iduser,
				  method:resp[a].method,
				  phone:resp[a].phone,
				  picture:resp[a].picture,
          position:resp[a].position,
				  organization:resp[a].organization

  			} as Iusers ));

            // Tomamos el primer registro
        this.profile = this.users[this.currentIndex];

        //console.log("this.profile", this.profile);

        // Creamos el dataSource
  			this.UsersDataSource = new MatTableDataSource(this.users);
  			this.UsersDataSource.paginator = this.paginator;
  			this.UsersDataSource.sort = this.sort;
  			this.loadData = false;

  		})

  	    }

         getdataCompany()
         {
           this.loadData2 = true;

           this.companyService.getData().subscribe((resp:any)=>{

             /*=============================================
           Integrando respuesta de base de datos con la interfaz
           =============================================*/
             let numberposition = 1;

             this.company = Object.keys(resp).map(a=> ({

               id:a,
               numberposition :numberposition++,
               address        :resp[a].address,
               city           :resp[a].city,
               country        :resp[a].country,
               displayName    :resp[a].displayName,
               email          :resp[a].email,
               phone          :resp[a].phone,
               picture        :resp[a].picture,
               rfc            :resp[a].rfc,
               state          :resp[a].state

             } as Icompany ));

             console.log('COMPANIAS', this.company);
             // Creamos el dataSource
             this.companyDataSource            = new MatTableDataSource(this.company);
             this.companyDataSource.paginator  = this.paginator;
             this.companyDataSource.sort       = this.sort;
             this.loadData2 = false;

           })

         }

         getdataBranchs(){
        this.branchService.getData().subscribe((resp:any)=>{

          this.loadData3 = true ;

            /*=============================================
          	Integrando la respuesta de base de dacion para tomar la data de usuarios
          	=============================================*/

            let position = Object.keys(resp).length;

            this.branch = Object.keys(resp).map(a=> ({

              id: a,
              idbra :resp[a].idbra,
              position: position --,
              active : resp[a].active,
              colony: resp[a].colony,
              country:resp[a].country,
              cp: resp[a].cp,
              id_empresa:resp[a].id_empresa,
              id_state:resp[a].id_state,
              iva:resp[a].iva,
              locality:resp[a].locality,
              municipality:resp[a].municipality,
              name:resp[a].name,
              number_exterior:resp[a].number_exterior,
              number_interior:resp[a].number_interior,
              street:resp[a].street

            } as Ibranch )) ;

          this.branchsDataSource = new MatTableDataSource(this.branch);

          this.branchsDataSource.paginator = this.paginator ;
          this.branchsDataSource.sort      = this.sort ;

          this.loadData3 = false ;
    } )
         }

         getdataProject()
         {
           this.loadData4 = true;

           this.projectsService.getDataprojects().subscribe((resp:any)=>{

             /*=============================================
           Integrando respuesta de base de datos con la interfaz
           =============================================*/
             let numberposition = 1;

             this.project = Object.keys(resp).map(a=> ({

                id:a,
                numberposition :numberposition++,
                code           :resp[a].code,
                contract       :resp[a].contract,
                description    :resp[a].description,
                image          :resp[a].image,
                tender         :resp[a].tender,
                ubication      :resp[a].ubication
             } as Iproject ));

             // Creamos el dataSource
             this.projectsDataSource            = new MatTableDataSource(this.project);
             this.projectsDataSource.paginator  = this.paginator;
             this.projectsDataSource.sort       = this.sort;
             this.loadData4 = false;

           })

         }

         getdataTracking()
      {

        this.loadData5 = true;

        this.trackingService.getTrackingRecordsByUser(this.profile.email).subscribe((resp:any)=>{

          /*=============================================
        Integrando respuesta de base de datos con la interfaz
        =============================================*/
          let numberposition = 1;

          this.log = Object.keys(resp).map(a=> ({

            id:a,
            numberposition :numberposition++,
            company        :resp[a].company,
            datetime       :resp[a].datetime,
            description    :resp[a].description,
            idn             :resp[a].idn,
            origin         :resp[a].origin,
            user           :resp[a].user

          } as Ilog ));

          // Creamos el dataSource
          this.trackingDataSource            = new MatTableDataSource(this.log);
          this.trackingDataSource.paginator  = this.paginator;
          this.trackingDataSource.sort       = this.sort;
          this.loadData5 = false;

        })

         }




 public async getUserEventData() {
  try {
    const result = await this.usersService.getUserEventData();
    console.log(result);
  }catch (err) {
    console.log(err);
  }

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



    newUsers() {

    }


    editUsers(id:string){


    }


      editBranchs(id:string){

       // const dialogRef = this.dialog.open(EditBranchComponent,{

       //   width:'100%',
       //   data: { id: id	}

      }



}

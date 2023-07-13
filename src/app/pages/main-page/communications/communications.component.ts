
import { Component, EventEmitter, OnInit,  ViewChild } from '@angular/core';

import { Icommunications } from 'src/app/interface/icommunication';
import { Idetailscom } from 'src/app/interface/idetailscom';
import { Idocumentscom } from 'src/app/interface/idocumentscom';

import { TraductorService } from 'src/app/services/traductor.service';
import { TrackingService } from 'src/app/services/tracking.service';
import { PrintreportsService } from 'src/app/services/printreports.service';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';


import { functions } from 'src/app/helpers/functions';

import { alerts } from 'src/app/helpers/alerts';

import { CommunicationsService } from 'src/app/services/communications.service';
import { NewcommunicComponent } from './newcommunic/newcommunic.component';

import { HttpClient } from '@angular/common/http';

import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-communications',
  template: '',
  templateUrl: './communications.component.html',
  styleUrls: ['./communications.component.css'],
})

export class CommunicationsComponent implements OnInit {


  selectedTab = 'comunication';
  isGeneratingPDF: boolean;


  fecha          : string;
  descripcion    : string;
  archivos       : File[] = [];

  interesados    : string[] = [];
  interestedList : any[] = [];

  onTabSelected(tabName: string) {
    this.selectedTab = tabName;

    if (tabName === 'details') {
      this.trackingService.addLog(
        '',
        'Click en la Pestaña Details/Detalles del menu Communications',
        'Communications',
        ''
      );
      this.getdatafindDetail();
    }

    if (tabName === 'documents') {
      this.trackingService.addLog(
        '',
        'Click en la Pestaña Documents del menu Communications',
        'Communications',
        ''

      );

      this.getDatafindDocuments()
    }
  }

  comDataSource!       : MatTableDataSource<Icommunications>; //Variable global que instancie la data que aparecerá en la Tabla
  detailsDataSource    : MatTableDataSource<Idetailscom>;
  documentsDataSource  : MatTableDataSource<Idocumentscom>

  comunications : Icommunications[] = [] ;
  detailscom    : Idetailscom[]     = [] ;
  documentscom  : Idocumentscom[]   = [] ;

  detailscom2   : Idetailscom[] = [];

  profile: any = {};

  loadData = false;
  loadData2 = false;

  screenSizeSM = false;
  currentIndex: number = 0;


  //  Variable para nombrar las columnas de nuestra tabla en Angular Material
  displayedColumns: string[] = [
    'numberposition',
    'procces',
    'information',
    'owner',
    'actions',
  ];

      // para mostrar columnas de detalles
      displayedColdetails: string[] = ['numberposition', 'name', 'email', 'actions'];

      // para mostrar columnas de documentos
      displayedColdocuments: string[] = ['numberposition', 'date', 'picture', 'actions'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
      private trackingService: TrackingService, private storage: AngularFireStorage,
      private communicationsService: CommunicationsService,
      public translateService    : TraductorService,
      public printReportsService : PrintreportsService,
      private formBuilder: FormBuilder,
      public http : HttpClient,
      private dialog: MatDialog
  ) {}

  ngOnInit(): void {

        this.getdataComunications();

        /*=============================================
        Definir tamaños de pantalla
        =============================================*/
        if (functions.screenSize(0, 767)) {
          this.screenSizeSM = true;
        } else {
          this.screenSizeSM = false;
        }

       this.getdataallDetails() ;

  }




 showProfile(commun: Icommunications) {
    // Actualizamos el currentIndex y el profile
    this.profile = commun;
  }


  getdataComunications() {
    this.loadData = true;

    this.communicationsService.getDataCommunications2(localStorage.getItem('project') )
      .subscribe((resp: any) => {
        /*=============================================
      Integrando respuesta de base de datos con la interfaz
      =============================================*/
        let numberposition = 1;

        this.comunications = Object.keys(resp).map(
          (a) =>
            ({
              id: a,
              numberposition : numberposition++,
              active         : resp[a].active,
              name           : resp[a].name,
              procces        : resp[a].procces,
              information    : resp[a].information,
              format         : resp[a].format,
              area           : resp[a].area,
              owner          : resp[a].owner,
              reference      : resp[a].reference,
              frequence      : resp[a].frequence,
              group          : resp[a].group,
              id_project     : ''
            } as Icommunications)
        );

       // console.log(this.comunications)
         this.profile = this.comunications[this.currentIndex]; // Tomamos el primer registro
         this.comDataSource = new MatTableDataSource(this.comunications); // Creamos el dataSource
         this.comDataSource.paginator = this.paginator;
         this.comDataSource.sort = this.sort;
         this.loadData = false;
      });
  }

  getdataallDetails() {
    this.loadData = true;

    this.communicationsService.getDataCommunicationsdetail()
      .subscribe((resp: any) => {

      //    console.log(resp);
        /*=============================================
      Integrando respuesta de base de datos con la interfaz
      =============================================*/
        let numberposition = 1;

        this.detailscom2 = Object.keys(resp).map(
          (a) =>
            ({
                 id     : resp[a].id,
                 active : resp[a].active,
                 name   : resp[a].name,
                 email  : resp[a].email,
            } as Idetailscom)
        );

      });
  }


  getdatafindDetail() {
  //  alert(this.profile.id) ;
    this.loadData2 = true;

    this.communicationsService.buscarSubdetalle(this.profile.id)
      .subscribe((resp: any) => {
        /*=============================================
    Integrando respuesta de base de datos con la interfaz
    =============================================*/
        let numberposition = 1;

        this.detailscom = Object.keys(resp).map(
          (a) =>
            ({
              id: resp[a].id,
              numberposition : numberposition++,
              active         : resp[a].active,
              name           : resp[a].name,
              email          : resp[a].email,
              position       : resp[a].position,
            } as Idetailscom)
        );

        // Creamos el dataSource
        this.detailsDataSource = new MatTableDataSource(this.detailscom);
        this.detailsDataSource.paginator = this.paginator;
        this.detailsDataSource.sort = this.sort;
        this.loadData2 = false;
      });
  }


  getDatafindDocuments() {

    this.loadData2 = true;

    this.communicationsService.buscarDatafindDocuments(this.profile.id)
      .subscribe((resp: any) => {
        /*=============================================
    Integrando respuesta de base de datos con la interfaz
    =============================================*/
        let numberposition = 1;

        this.documentscom = Object.keys(resp).map(
          (a) =>
            ({
              id: resp[a].id,
              numberposition   : numberposition++,
              active           : resp[a].active,
              date             : resp[a].date,
              picture          : resp[a].picture,
              description      : resp[a].description,
              id_communication : this.profile.id
            } as Idocumentscom)
        );

        //console.log('details', this.detailscom);
        // Creamos el dataSource
        this.documentsDataSource = new MatTableDataSource(this.documentscom);
        this.documentsDataSource.paginator = this.paginator;
        this.documentsDataSource.sort = this.sort;
        this.loadData2 = false;
      });
  }


  newCommunications(formType: string) {

    const dialogRef = this.dialog.open(NewcommunicComponent, { data: { formType: formType } });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getdataComunications();
      }
    });

  }


  newDocuments(formType: string) {

      const dialogRef = this.dialog.open(NewcommunicComponent, { data: { formType: formType } });

         dialogRef.afterClosed().subscribe(result => {
        if (result) {

          this.getDatafindDocuments();
        }
      });

  }

  editCommunic(id: string) {}

  editDetails(id: string) {}



  deleteCommunic(id: string) {
      alerts.confirmAlert('Are you sure?', 'The information cannot be recovered!', 'warning','Yes, delete it!')
        .then((result) => {

      if (result.isConfirmed) {
            this.communicationsService.buscarSubdetalle(id).

              subscribe(

                 (resp:any) => {

                  if (Object.keys(resp).length > 0) {
                        alerts.basicAlert('error', "The communication has related permission", "error")
                  } else {

                    this.communicationsService.deleteCommunications(id, localStorage.getItem('token'))

                    .subscribe(
                      () => {

                          alerts.basicAlert("Sucess", "The user has been deleted", "success")

                          this.getdataComunications();
                      }
                    )
                  }

               }
           )
      }
    })
  }


  detailsdata() {}


  applyFilter(dataSource: MatTableDataSource<any>, event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    dataSource.filter = filterValue.trim().toLowerCase();

    if (dataSource.paginator) {
      dataSource.paginator.firstPage();
    }
  }



  getCommunicint() {
    //aqui qe pasar el id project que tengo los combo box
    this.communicationsService.getCommunications(this.trackingService.getProject())
      .then(dataInteres => {

        this.interestedList = dataInteres;
      })
      .catch(error => {
        console.log('Error:', error);
      });
  }


  generarReporte(){

    this.printReportsService.generarReporte(this.detailscom2, this.comunications);

  }






}







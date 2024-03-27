import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Isapequipment } from 'src/app/interface/isapequip';
import { Ipsv } from 'src/app/interface/ipsv';
import { Imanometer } from 'src/app/interface/imanometer';

import { TrackingService } from 'src/app/services/tracking.service';
import { SapequipmentService } from 'src/app/services/sapequipment.service';
import { PsvService } from 'src/app/services/psv.service';
import { ManometerService } from 'src/app/services/manometer.service';
import { PrintreportsService } from 'src/app/services/printreports.service';

import { alerts } from 'src/app/helpers/alerts';

import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';


@Component({
  selector: 'app-sapequipos',
  templateUrl: './sapequipos.component.html',
  styleUrls: ['./sapequipos.component.css']
})
export class SapequiposComponent implements OnInit {

  selectedTab = 'SAP';

  serialnumber : string = '' ;
  brand        : string = '' ;

  profile: any = {};

  sapDataSource!  : MatTableDataSource<Isapequipment> ;
  psvDataSource! : MatTableDataSource<Ipsv> ;
  manDataSource!  : MatTableDataSource<Imanometer> ;

  currentIndex: number = 0;

  screenSizeSM = false;

  sapequipments  : Isapequipment[] = [] ;
  psv            : Ipsv[] = [] ;
  manometers     : Imanometer[] = [] ;

  loadData     = false;

   displayedColSap: string[] = [
   'numberposition',  'sapnumber', 'status',  'actions'];

   displayedColPsv: string[] = [
    'consecutivo',  'serialnumber', 'brand',  'actions'];

   displayedColManom: string[] = [
      'consecutivo',  'brand', 'identification',  'actions'];

 @ViewChild(MatPaginator) paginator: MatPaginator;
 @ViewChild(MatSort) sort!: MatSort;

  constructor(public route: ActivatedRoute,
              private trackingService: TrackingService,
              private SAPEquipmentService: SapequipmentService,
              private PSVService         : PsvService ,
              private ManometersService  : ManometerService
    ) { }

  ngOnInit() {
    this.getDataSAP() ;
    this.getDataPsv() ;
    this.getDataManometer() ;

    this.route.queryParams.subscribe(params => {
      if (params['tab']) {
        this.onTabSelected(params['tab']);
      }
    });
  }


  newSap(formType : string) {

  }

  newValv(formType : string) {

  }

  newMan(formType : string) {

  }

  infPsv(id: number) {
    this.serialnumber = this.psv[id].serialnumber; // Tomamos el primer registro
    console.log('SerialNumber: ',this.serialnumber);

  }

  infMan() {
    this.brand = this.manometers[0].brand; // Tomamos el primer registro
  }


  onTabSelected(tabName: string) {
    this.selectedTab = tabName;

    if (tabName === 'SAP') {
      this.trackingService.addLog(
         this.trackingService.getnameComp(),
        'Click en la Pestaña Equipos Sap',
        'SAP',
        this.trackingService.getEmail()
      );
      this.getDataSAP();
    }

    if (tabName === 'valvules') {
      this.trackingService.addLog(
        this.trackingService.getnameComp(),
        'Click en la Pestaña PSV',
        'Valvulas',
        this.trackingService.getEmail()
     );
     this.getDataPsv() ;
    }

    if (tabName === 'Manometros') {
      this.trackingService.addLog(
        this.trackingService.getnameComp(),
        'Click en la Pestaña Manometros',
        'Manometers',
        this.trackingService.getEmail()
      );
      this.getDataManometer() ;
    }
  }

  printSap() {

  }

  showProfile(sap: Isapequipment) {
    // Actualizamos el currentIndex y el profile
    this.profile = sap;
    //this.trackingService.setnumpro(this.profile.id)
  }


  getDataSAP() {
    this.loadData = true;

    this.SAPEquipmentService.getsapEquipment(this.trackingService.getPlataforma())
      .subscribe((resp: any) => {
        /*=============================================
      Integrando respuesta de base de datos con la interfaz
      =============================================*/
        let numberposition = 1;

        this.sapequipments = Object.keys(resp).map(
          (a) =>
            ({
                id               : resp[a].id,
                sapnumber        : resp[a]?.sapNumber,
                tag              : resp[a]?.tag,
                protectequipment : resp[a]?.protectEquipment,
                cont             : resp[a]?.cont,
                picture          : resp[a]?.picture,
                placedownload    : resp[a]?.placeDownload,
                consecutivo      : resp[a]?.consecutivo,
            } as Isapequipment)
        );
         //  console.log('SAP', this.sapequipments) ;
           this.profile = this.sapequipments[this.currentIndex]; // Tomamos el primer registro

          // console.log('Profile', this.profile) ;

           this.trackingService.setnumpro(this.profile.id)
           this.sapDataSource = new MatTableDataSource(this.sapequipments)
           this.sapDataSource.paginator = this.paginator ;
           this.sapDataSource.sort = this.sort;
           this.loadData = false;
      });

  }

  getDataPsv() {
    this.loadData = true;
    console.log("getPlataforma",this.trackingService.getPlataforma())
    this.PSVService.getPsv(this.trackingService.getPlataforma())

      .subscribe((resp: any) => {
        /*=============================================
      Integrando respuesta de base de datos con la interfaz
      =============================================*/
        let numberposition = 1;

        this.psv = Object.keys(resp).map(
          (a) =>
            ({
                //id               : resp[a].id,
                brand            : resp[a]?.brand,
                serialnumber     : resp[a]?.serialNumber,
                typevalvule      : resp[a]?.typeValvule,
                consecutivo      : resp[a]?.consecutivo,
            } as Ipsv)
        );
           // console.log('PSV', this.psv) ;
           this.serialnumber = this.psv[0].serialnumber; // Tomamos el primer registro
           this.trackingService.setnumpro(this.profile.id)
           this.psvDataSource = new MatTableDataSource(this.psv)
           this.psvDataSource.paginator = this.paginator ;
           this.psvDataSource.sort = this.sort;
           this.loadData = false;
      });

  }

  getDataManometer() {
    this.loadData = true;

    this.ManometersService.getManometer(this.trackingService.getPlataforma())
      .subscribe((resp: any) => {
        /*=============================================
      Integrando respuesta de base de datos con la interfaz
      =============================================*/
        let numberposition = 1;

        this.manometers = Object.keys(resp).map(
          (a) =>
            ({
                id               : resp[a].id,
                brand            : resp[a]?.brand,
                identification   : resp[a]?.identification,
                numberserie      : resp[a]?.numberserie,
                consecutivo      : resp[a]?.consecutivo,
            } as Imanometer)
        );
         //   console.log('MANOMETERS', this.manometers) ;
            this.brand = this.manometers[0].brand ; // Tomamos el primer registro

           this.manDataSource = new MatTableDataSource(this.manometers)
           this.manDataSource.paginator = this.paginator ;
           this.manDataSource.sort = this.sort;
           this.loadData = false;
      });

  }

  edit (id: string) {

  }

  delete(id : string) {

  }

  applyFilter(dataSource: MatTableDataSource<any>, event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    dataSource.filter = filterValue.trim().toLowerCase();

    if (dataSource.paginator) {
      dataSource.paginator.firstPage();
    }
  }

}

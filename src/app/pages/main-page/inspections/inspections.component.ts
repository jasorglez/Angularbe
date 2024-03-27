import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Ipsv } from 'src/app/interface/ipsv';
import { PsvService } from 'src/app/services/psv.service';

import { TrackingService } from 'src/app/services/tracking.service';

import { PrintreportsService } from 'src/app/services/printreports.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-inspections',
  templateUrl: './inspections.component.html',
  styleUrls: ['./inspections.component.css']
})
export class InspectionsComponent implements OnInit {

  selectedTab = 'INSP';

  onTabSelected(tabName: string) {
    this.selectedTab = tabName;

    if (tabName === 'INSP') {
      this.trackingService.addLog(
         this.trackingService.getnameComp(),
        'Click en la Pestaña Equipos Sap',
        'SAP',
        this.trackingService.getEmail()
      );
      this.getDataPSV();
    }

    if (tabName === 'actas') {
      this.trackingService.addLog(
        this.trackingService.getnameComp(),
        'Click en la Pestaña Minutes',
        'Inspections',
        this.trackingService.getEmail()

     );
    }

    if (tabName === 'resguards') {
      this.trackingService.addLog(
        this.trackingService.getnameComp(),
        'Click en la Pestaña PSV',
        'Valvulas',
        this.trackingService.getEmail()

     );
    }

    if (tabName === 'students') {
      this.trackingService.addLog(
        this.trackingService.getnameComp(),
        'Click en la Pestaña Estudiantes',
        'Training',
        this.trackingService.getEmail()
      );

    }
  }
  currentIndex: number = 0;

  screenSizeSM = false;

  profile        : any = {};
  psv            : Ipsv[] = [];
  psvDataSource !: MatTableDataSource<Ipsv> ;

  displayedColpsv: string[] = ['consecutivo','sap', 'serial',  'model', 'brand', 'actions'];

  loadData      = false ;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private trackingService: TrackingService,
              private psvService : PsvService,
              public route: ActivatedRoute) { }

  ngOnInit() {
    this.trackingService.setultimaVentana('PSV')
    this.getDataPSV() ;
    this.route.queryParams.subscribe(params => {
      if (params['tab']) {
        this.onTabSelected(params['tab']);
      }
    });

  }

  newInsp(formType: string)
  {

  }

  newMinute(formType: string)
  {

  }

  showProfile(course: Ipsv) {
    // Actualizamos el currentIndex y el profile
     this.profile = course;
     this.trackingService.setidEmp(this.profile.id) ;
  }

  editPsv(id:string) {

  }

  deletePsv(id: string) {

  }


  getDataPSV() {
    this.loadData = true;

    this.psvService.getPsv(this.trackingService.getPlataforma())
      .subscribe((resp: any) => {
        //Integrando respuesta de base de datos con la interfaz
      this.psv = Object.keys(resp).map(
          (a) =>
            ({
               picture        : resp[a]?.picture,
               brand          : resp[a]?.manombrand,
               serialnumber   : resp[a].serialNumber,
               model          : resp[a].sap,
               typevalvule    : resp[a].model,
               consecutivo    : resp[a].consecutivo

             } as Ipsv)
        );

           this.psvDataSource           = new MatTableDataSource(this.psv)
           this.profile = this.psv[this.currentIndex]; // Tomamos el primer registro

           this.psvDataSource  .paginator = this.paginator ;
           this.psvDataSource  .sort      = this.sort;
           this.loadData = false;


      });

  }

  printSap() {

  }


  applyFilter(dataSource: MatTableDataSource<any>, event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    dataSource.filter = filterValue.trim().toLowerCase();

    if (dataSource.paginator) {
      dataSource.paginator.firstPage();
    }
  }


}

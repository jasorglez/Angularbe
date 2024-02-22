
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';


import { Iproviders } from 'src/app/interface/iproviders';
import { ProvidersService } from 'src/app/services/providers.service';

import { TrackingService } from 'src/app/services/tracking.service';
import { alerts } from 'src/app/helpers/alerts';
import { MatDialog } from '@angular/material/dialog';

import { NewProvComponent } from './newProv/newProv.component';
import { EditProvComponent } from './editProv/editProv.component';

import { Router } from '@angular/router';


@Component({
  selector: 'app-comprov',
  templateUrl: './comprov.component.html',
  styleUrls: ['./comprov.component.css']
})
export class ComprovComponent implements OnInit {

  selectedTab = 'providers';

  profile: any = {};

  onTabSelected(tabName: string) {
    this.selectedTab = tabName;

    if (tabName === 'providers') {
      this.trackingService.addLog(
         this.trackingService.getnameComp(),
        'Click en la Pestaña Proveedores',
        'Employees',
        this.trackingService.getEmail()
      );
      this.getDataProviders();
    }

    if (tabName === 'orders') {
      this.trackingService.addLog(
        this.trackingService.getnameComp(),
        'Click en la Pestaña Orders',
        'Orders',
        this.trackingService.getEmail()
      );

    }


    if (tabName === 'pays') {
      this.trackingService.addLog(
        this.trackingService.getnameComp(),
        'Click en la Pestaña Estudiantes',
        'Training',
        this.trackingService.getEmail()
      );
    }


  }


 providersDataSource!  : MatTableDataSource<Iproviders> ;
 currentIndex: number = 0;

 screenSizeSM = false;

 providers    : Iproviders[] = [] ;

 loadData     = false;

 displayedColproviders: string[] = [
  'numberposition',  'name', 'mail',  'actions'];


@ViewChild(MatPaginator) paginator: MatPaginator;
@ViewChild(MatSort) sort!: MatSort;


  constructor(private trackingService: TrackingService,
      private ProvidersService : ProvidersService,
      public dialog: MatDialog,
      private router: Router ) { }

  ngOnInit() {
     this.getDataProviders();
  }

  showProfile(course: Iproviders) {
    // Actualizamos el currentIndex y el profile
    this.profile = course;
  }


  getDataProviders() {
    this.loadData = true;

    this.ProvidersService.getProviders(localStorage.getItem('company'))
      .subscribe((resp: any) => {
        /*=============================================
      Integrando respuesta de base de datos con la interfaz
      =============================================*/
        let numberposition = 1;

        this.providers = Object.keys(resp).map(
          (a) =>
            ({
                id          : resp[a].id,
                razonsocial : resp[a]?.razonsocial,
                razoncorta  : resp[a]?.razoncorta,
                address     : resp[a]?.address,
                id_company  : resp[a]?.id_company,
                cp          : resp[a]?.cp,
                city        : resp[a]?.city,
                country     : resp[a].country,
                rfc         : resp[a]?.rfc,
                email       : resp[a]?.email,
                phone       : resp[a]?.phone,
                numberposition: numberposition++
            } as Iproviders)
        );

           this.profile = this.providers[this.currentIndex]; // Tomamos el primer registro
           this.providersDataSource = new MatTableDataSource(this.providers)
           this.providersDataSource.paginator = this.paginator ;
           this.providersDataSource.sort = this.sort;
           this.loadData = false;
      });

  }


  newProviders(formType : string){
    const dialogRef = this.dialog.open(NewProvComponent,
      { data: { formType: formType } });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        alerts.confirmAlert('Se realizo el registro correctamente', 'Register new Ok', 'success', 'Ok').then((result) => {
          this.getDataProviders() ;
        });
      }
    });
  }


  editProviders (id : string){
      const dialogRef = this.dialog.open(EditProvComponent, {

        width:'28%',
        data: { id: id	}
      })


      dialogRef.afterClosed().subscribe(result =>{

        if(result){
          this.getDataProviders();
        }})

  }


  deleteProviders (id : string){
    alerts.confirmAlert('Are you sure?', 'The information cannot be recovered!', 'warning','Yes, delete it!')
    .then((result) => {

        if (result.isConfirmed) {

          this.ProvidersService.delete(id, localStorage.getItem('token'))
          .subscribe( () => {

              alerts.basicAlert("Sucess", "The course has been deleted", "success")

              this.getDataProviders() ;
            })
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

}

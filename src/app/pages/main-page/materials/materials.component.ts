
import { Component, OnInit, ViewChild } from '@angular/core';

import { Imaterials } from 'src/app/interface/imaterials';

import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { TrackingService } from 'src/app/services/tracking.service';
import { alerts } from 'src/app/helpers/alerts';

import { MaterialsService } from '../../../services/materials.service';
import { NewMatComponent } from './newMat/newMat.component';

@Component({
  selector: 'app-materials',
  templateUrl: './materials.component.html',
  styleUrls: ['./materials.component.css']
})
export class MaterialsComponent implements OnInit {

  selectedTab = 'supplies';

  profile: any = {};

  onTabSelected(tabName: string) {
    this.selectedTab = tabName;

    if (tabName === 'supplies') {
      this.trackingService.addLog(
         this.trackingService.getnameComp(),
        'Click en la Pestaña Supplies',
        'Employees',
        this.trackingService.getEmail()
      );
      this.getDataSupplies();
    }

    if (tabName === 'instructors') {
      this.trackingService.addLog(
        this.trackingService.getnameComp(),
        'Click en la Pestaña Instructores',
        'Training',
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


 materialsDataSource!  : MatTableDataSource<Imaterials> ;
 currentIndex: number = 0;

 screenSizeSM = false;

 materials    : Imaterials[] = [] ;

 loadData     = false;

 displayedCol: string[] = [
  'numberposition',  'insumo', 'description', 'measure', 'sale', 'actions'];


@ViewChild(MatPaginator) paginator: MatPaginator;
@ViewChild(MatSort) sort!: MatSort;

  constructor(private trackingService: TrackingService,
     private materialsSer : MaterialsService,
     public dialog: MatDialog ) { }

  ngOnInit() {
    this.getDataSupplies() ;
  }

  showProfile(course: Imaterials) {
    // Actualizamos el currentIndex y el profile
    this.profile = course;
  }


   getDataSupplies() {
    this.loadData = true;

    this.materialsSer.getSupplies(localStorage.getItem('company'))
      .subscribe((resp: any) => {
        /*=============================================
      Integrando respuesta de base de datos con la interfaz
      =============================================*/
        let numberposition = 1;

        this.materials = Object.keys(resp).map(
          (a) =>
            ({
              id           : resp[a].id,
              insumo       : resp[a]?.insumo,
              description  : resp[a]?.description,
              measure      : resp[a]?.descMes,
              family       : resp[a]?.descFam,
              ubication    : resp[a]?.descUbic,
              ventaMN      : resp[a]?.ventaMN,
              picture      : resp[a]?.picture,
              numberposition: numberposition++

            } as Imaterials)
        );

            this.profile                       = this.materials[this.currentIndex]; // Tomamos el primer registro
           this.materialsDataSource           = new MatTableDataSource(this.materials)
           this.materialsDataSource.paginator = this.paginator ;
           this.materialsDataSource.sort      = this.sort;
           this.loadData = false;
      });

   }


  newSupplies(formType: string) {
    const dialogRef = this.dialog.open(NewMatComponent, {
      width: '40%',
       data: { formType: formType }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        alerts.confirmAlert('Se realizo el registro correctamente', 'Register new Ok', 'success', 'Ok').then((result) => {
          this.getDataSupplies() ;
        });
      }
    });
    };


   editSupplies( id: string) {


  }


  deleteSupplies(id: string) {

    alerts.confirmAlert('Are you sure?', 'The information cannot be recovered!', 'warning','Yes, delete it!')
    .then((result) => {

        if (result.isConfirmed) {

          this.materialsSer.delete(id, localStorage.getItem('token'))
          .subscribe( () => {

              alerts.basicAlert("Sucess", "The course has been deleted", "success")

              this.getDataSupplies() ;
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

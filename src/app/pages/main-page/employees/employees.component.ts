import { Component, OnInit, ViewChild } from '@angular/core';
import { TrackingService } from 'src/app/services/tracking.service';

import { Iemployees } from 'src/app/interface/iemployees';
import { EmployeesService } from 'src/app/services/employees.service';
import { PrintreportsService } from 'src/app/services/printreports.service';

import { alerts } from 'src/app/helpers/alerts';

import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { NewemployeesComponent } from './newemployees/newemployees.component';
import { EditemployeesComponent } from './editemployees/editemployees.component';
import { ResguardsComponent } from './resguards/resguards.component';



@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit {

  selectedTab = 'employees';

  profile: any = {};

  onTabSelected(tabName: string) {
    this.selectedTab = tabName;

    if (tabName === 'employees') {
      this.trackingService.addLog(
         this.trackingService.getnameComp(),
        'Click en la Pestaña Employees',
        'Employees',
        this.trackingService.getEmail()
      );
      this.getDataEmployees();
    }

    if (tabName === 'resguards') {
      this.trackingService.addLog(
        this.trackingService.getnameComp(),
        'Click en la Pestaña Resguardos',
        'Employees',
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

 employeesDataSource!  : MatTableDataSource<Iemployees> ;

 currentIndex: number = 0;

 screenSizeSM = false;

 employees    : Iemployees[] = [] ;

 loadData     = false;

 displayedColemployees: string[] = ['number', 'direct',  'actions'];

@ViewChild(MatPaginator) paginator: MatPaginator;
@ViewChild(MatSort) sort!: MatSort;

  constructor(private trackingService: TrackingService,
              public printReportsService : PrintreportsService,
              private employeesServ : EmployeesService,
              public dialog: MatDialog) { }


  ngOnInit() {

    this.getDataEmployees() ;
  }


  showProfile(course: Iemployees) {
    // Actualizamos el currentIndex y el profile
     this.profile = course;
     this.trackingService.setidEmp(this.profile.id) ;
  }


  getDataEmployees() {

      this.loadData = true;

      this.employeesServ.getEmployees(localStorage.getItem('company'))
        .subscribe((resp: any) => {
          /*=============================================
        Integrando respuesta de base de datos con la interfaz
        =============================================*/
          let numberposition = 1;

          this.employees = Object.keys(resp).map(
            (a) =>
              ({
                id        : resp[a].id,
                direction : resp[a]?.descDir,
                area      : resp[a]?.descArea,
                position  : resp[a]?.position,
                ident_emp : resp[a]?.identEmp,
                name      : resp[a]?.name,
                picture   : resp[a]?.picture,
                numberposition: numberposition++

              } as Iemployees)
          );
             this.profile = this.employees[this.currentIndex]; // Tomamos el primer registro
             this.trackingService.setidEmp(this.profile.id) ;
             this.employeesDataSource = new MatTableDataSource(this.employees)
             this.employeesDataSource.paginator = this.paginator ;
             this.employeesDataSource.sort = this.sort;
             this.loadData = false;
        });

    }


  newEmployees(formType: string) {
    const dialogRef = this.dialog.open(NewemployeesComponent,
      { data: { formType: formType } });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        alerts.confirmAlert('Se realizo el registro correctamente', 'Register new Ok', 'success', 'Ok').then((result) => {
          this.getDataEmployees() ;
        });
      }
    });

  }


  editEmployees( id: string) {
    const dialogRef = this.dialog.open(EditemployeesComponent, {

      width:'40%',
      data: { id: id	}
    })


    dialogRef.afterClosed().subscribe(result =>{

      if(result){
        this.getDataEmployees();
      }})

  }


  deleteEmployees(id: string) {

    alerts.confirmAlert('Are you sure?', 'The information cannot be recovered!', 'warning','Yes, delete it!')
    .then((result) => {

        if (result.isConfirmed) {

          this.employeesServ.deleteEmployee(id, localStorage.getItem('token'))
          .subscribe( () => {

              alerts.basicAlert("Sucess", "The course has been deleted", "success")

              this.getDataEmployees() ;
            })
          }
    })
  }

  printResg() {
     this.printReportsService.Resguardo(this.profile.name, this.profile.position, this.profile.direction, this.profile.ident_emp) ;
  }


  applyFilter(dataSource: MatTableDataSource<any>, event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    dataSource.filter = filterValue.trim().toLowerCase();

    if (dataSource.paginator) {
      dataSource.paginator.firstPage();
    }
  }


}

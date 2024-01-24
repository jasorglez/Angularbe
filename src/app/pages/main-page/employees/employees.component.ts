import { Component, OnInit, ViewChild } from '@angular/core';

import { TraductorService } from 'src/app/services/traductor.service';
import { TrackingService } from 'src/app/services/tracking.service';

import { Iemployees } from 'src/app/interface/iemployees';
import { EmployeesService } from 'src/app/services/employees.service';

import { alerts } from 'src/app/helpers/alerts';

import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { NewemployeesComponent } from './newemployees/newemployees.component';
import { EditemployeesComponent } from './editemployees/editemployees.component';

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

 employeesDataSource!  : MatTableDataSource<Iemployees> ;

 currentIndex: number = 0;

 screenSizeSM = false;

 employees    : Iemployees[] = [] ;

 loadData     = false;

 displayedColemployees: string[] = [
  'numberposition',  'name', 'mail',  'rfc', 'actions'];


@ViewChild(MatPaginator) paginator: MatPaginator;
@ViewChild(MatSort) sort!: MatSort;


  constructor(private trackingService: TrackingService,
              private employeesServ : EmployeesService,
              public dialog: MatDialog) { }


  ngOnInit() {

    this.getDataEmployees() ;
  }

  showProfile(course: Iemployees) {
    // Actualizamos el currentIndex y el profile
    this.profile = course;

  }


  getDataEmployees() {

      this.loadData = true;

      console.log(localStorage.getItem('company'))

      this.employeesServ.getEmployees(localStorage.getItem('company'))
        .subscribe((resp: any) => {
          /*=============================================
        Integrando respuesta de base de datos con la interfaz
        =============================================*/
          let numberposition = 1;

          this.employees = Object.keys(resp).map(
            (a) =>
              ({
                id         :   resp[a].id,
                address    :   resp[a]?.address,  
                age        :   resp[a]?.age,
                city       :   resp[a]?.city,
                colony     :   resp[a]?.colony,
                country    :   resp[a]?.country,
                cp         :   resp[a]?.cp,
                curp       :   resp[a]?.curp,
                email      :   resp[a]?.email,
                ident_emp  : resp[a]?.identity,
                id_company : resp[a]?.id_company,
                name       : resp[a]?.name,
                phone      : resp[a]?.phone,
                picture    : resp[a]?.picture,
                rfc        : resp[a]?.rfc,
                salary     :   0,
                numberposition: numberposition++

              } as Iemployees)
          );

             this.profile = this.employees[this.currentIndex]; // Tomamos el primer registro
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

      width:'60%',
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

          this.employeesServ.delete(id, localStorage.getItem('token'))
          .subscribe( () => {

              alerts.basicAlert("Sucess", "The course has been deleted", "success")

              this.getDataEmployees() ;
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

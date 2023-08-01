import { Component, OnInit, ViewChild } from '@angular/core';

import { TraductorService } from 'src/app/services/traductor.service';
import { TrackingService } from 'src/app/services/tracking.service';
import { TrainingService } from 'src/app/services/training.service';
import { alerts } from 'src/app/helpers/alerts';

import { Icourse } from 'src/app/interface/icourses';
import { Iinstructors } from 'src/app/interface/iinstructors';

import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { NewcoinstComponent } from './newcoinst/newcoinst.component';
import { Icategories } from 'src/app/interface/icategories';
import { InstructorsService } from '../../../services/instructors.service';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.css']
})
export class TrainingComponent implements OnInit {

  selectedTab = 'courses';
  profile: any = {};

  onTabSelected(tabName: string) {
    this.selectedTab = tabName;

    if (tabName === 'courses') {
      this.trackingService.addLog(
         this.trackingService.getnameComp(),
        'Click en la Pestaña Courses',
        'Cursos',
        this.trackingService.getEmail()
      );
      this.getdataCourses();
    }

    if (tabName === 'lessons') {
      this.trackingService.addLog(
        this.trackingService.getnameComp(),
        'Click en la Pestaña Lecciones aprendidas',
        'Conceptos',
        this.trackingService.getEmail()
      );

    //  this.getdataLessonsl()
    }
  }

 coursesDataSource!     : MatTableDataSource<Icourse> ;
 instructorsDataSource! : MatTableDataSource<Iinstructors> ;

 training : Icourse[] = [] ;
 instructors : Iinstructors[] = [] ;

 screenSizeSM = false;

 fileUrl : string ;
 currentIndex: number = 0;

 loadData     = false;

  displayedColcourses: string[] = [
    'numberposition',  'name', 'dates',
    'datee', 'actions'];


  displayedColinstructors: string[] = [
    'numberposition',  'name', 'mail','CV',
    'REs', 'Eva', 'actions'];


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  constructor(private trackingService: TrackingService,
        private translateService  : TraductorService,
        private trainingService   : TrainingService,
        private instructorsService : InstructorsService,
        public dialog: MatDialog) { }

  ngOnInit() {
    this.getdataCourses() ;
    this.getdataInstructors();
  }


  showProfile(commun: Icourse) {
    // Actualizamos el currentIndex y el profile
    this.profile = commun;
    this.trackingService.setidlesson( this.profile.id) ;

  }


  getdataCourses() {

    this.loadData = true;

   // console.log("Project", localStorage.getItem('project'))

    this.trainingService.getTraining(localStorage.getItem('project'))
      .subscribe((resp: any) => {
        /*=============================================
      Integrando respuesta de base de datos con la interfaz
      =============================================*/
        let numberposition = 1;

        this.training = Object.keys(resp).map(
          (a) =>
            ({
               id: a,
               numberposition : numberposition++,
               name           : resp[a].name,
               dStart         : resp[a].dStart,
               dEnd           : resp[a].dEnd,
               description    : resp[a].description,
               instructor     : resp[a].instructor,
               id_project     : resp[a].id_project,
               place          : resp[a].place,
               schedule       : resp[a].schedule,
               file1          : resp[a].file1,
               file2          : resp[a].file2,
               file3          : resp[a].file3,
            } as Icourse)
        );

           console.log("cOURSES", this.training) ;
           this.profile = this.training[this.currentIndex]; // Tomamos el primer registro
           this.fileUrl = this.profile.file ;

           this.coursesDataSource = new MatTableDataSource(this.training)
           this.coursesDataSource.paginator = this.paginator ;
           this.coursesDataSource.sort = this.sort;
           this.loadData = false;
      });

  }

  getdataInstructors()  {
    this.loadData = true;

  //   console.log("Company", localStorage.getItem('company'))

     this.instructorsService.getInstructorsAll(localStorage.getItem('company'))
       .subscribe((resp: any) => {
         /*=============================================
       Integrando respuesta de base de datos con la interfaz
       =============================================*/
         let numberposition = 1;

         this.instructors = Object.keys(resp).map(
           (a) =>
             ({
                id: a,
                numberposition : numberposition++,
                active         : resp[a].active,
                address        : resp[a].address,
                email          : resp[a].email,
                invoice        : resp[a].invoice,
                file1          : resp[a].file1,
                file2          : resp[a].file2,
                file3          : resp[a].file3,
                id_company     : resp[a].id_company,
                id_course      : resp[a].id_course,
                name           : resp[a].name,
                phone          : resp[a].phone,
                program        : resp[a].program,
                rfc            : resp[a].rfc,
                speciality     : resp[a].speciality,
                qualification  : resp[a].qualification
             } as Iinstructors)
         );

           console.log("Instructors", this.instructors) ;
            //this.profile = this.training[this.currentIndex]; // Tomamos el primer registro
            this.instructorsDataSource = new MatTableDataSource(this.instructors)
            this.instructorsDataSource.paginator = this.paginator ;
            this.instructorsDataSource.sort = this.sort;
            this.loadData = false;
       });
  }


  newCourses(formType: string) {
    const dialogRef = this.dialog.open(NewcoinstComponent,
      { data: { formType: formType } });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        alerts.confirmAlert('Se realizo el registro correctamente', 'Register new Ok', 'success', 'Ok').then((result) => {
          this.getdataCourses();
        });
      }
    });

  }


  newInstructors(formType : string) {
    const dialogRef = this.dialog.open(NewcoinstComponent, { data: { formType: formType } });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        alerts.confirmAlert('Se realizo el registro correctamente', 'Register new Ok', 'success', 'Ok').then((result) => {
          this.getdataInstructors();
        });
      }
    });

  }


  editCourse(id: string) {

  }

  editInstructor(id: string) {

  }


  deleteCourse(id: string) {
    alerts.confirmAlert('Are you sure?', 'The information cannot be recovered!', 'warning','Yes, delete it!')
    .then((result) => {

        if (result.isConfirmed) {

          this.trainingService.deleteCourse(id, localStorage.getItem('token'))
          .subscribe( () => {

              alerts.basicAlert("Sucess", "The course has been deleted", "success")

              this.getdataCourses() ;
            })
          }
    })
 }

 deleteInstructor(id: string) {
  alerts.confirmAlert('Are you sure?', 'The information cannot be recovered!', 'warning','Yes, delete it!')
  .then((result) => {

      if (result.isConfirmed) {

        this.instructorsService.deleteInstructors(id, localStorage.getItem('token'))
        .subscribe( () => {

            alerts.basicAlert("Sucess", "The Instructor has been deleted", "success")

            this.getdataInstructors() ;
          })
        }
  })
 }


  openLink(url: string) {
    // este es el ultimo cambio que subi
    window.open(url, '_blank');
  }



  applyFilter(dataSource: MatTableDataSource<any>, event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    dataSource.filter = filterValue.trim().toLowerCase();

    if (dataSource.paginator) {
      dataSource.paginator.firstPage();
    }
  }

}

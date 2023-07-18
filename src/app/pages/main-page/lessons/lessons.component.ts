import { Component, OnInit, ViewChild, NgModule } from '@angular/core';

import { TraductorService } from 'src/app/services/traductor.service';
import { TrackingService } from 'src/app/services/tracking.service';

import { Ilessons } from 'src/app/interface/ilessons';
import { Ilearned } from 'src/app/interface/ilearned';

import { PrintreportsService } from 'src/app/services/printreports.service';

import { LessonsService } from 'src/app/services/lessons.service';
import { LessonslearnedService } from 'src/app/services/lessonslearned.service';
import { alerts } from 'src/app/helpers/alerts';

import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';


import { NewlessComponent } from './newless/newless.component';


@Component({
  selector: 'app-lessons',
  templateUrl: './lessons.component.html',
  styleUrls: ['./lessons.component.css']
})
export class LessonsComponent implements OnInit {
  profileId : string = '';
  selectedTab = 'meeting';
  profile: any = {};

  onTabSelected(tabName: string) {
    this.selectedTab = tabName;

    if (tabName === 'meeting') {
      this.trackingService.addLog(
         this.trackingService.getnameComp(),
        'Click en la Pestaña Meeting',
        'Conceptos',
        this.trackingService.getEmail()
      );
      this.getdataMeeting();
    }

    if (tabName === 'lessons') {
      this.trackingService.addLog(
        this.trackingService.getnameComp(),
        'Click en la Pestaña Lecciones aprendidas',
        'Conceptos',
        this.trackingService.getEmail()
      );

      this.getdataLessonsl()
    }
  }

  lessonsDataSource!   : MatTableDataSource<Ilessons>;
  learnedDataSource!   : MatTableDataSource<Ilearned>;

  meeting  : Ilessons[] = [] ;
  lessonsl : Ilearned[] = [] ;

  screenSizeSM = false;

  fileUrl : string ;
  currentIndex: number = 0;

  loadData     = false;

  displayedColmeeting: string[] = [
    'numberposition',
    'type',
    'place',
    'date',
    'time',
    'actions',
  ];


  displayedCollessons: string[] = [
    'numberposition',  'concept', 'lessons',
    'evidence', 'signed', 'actions'];


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private trackingService: TrackingService,
    private translateService      : TraductorService,
    private lessonsService        : LessonsService,
    private lessonslearnedService : LessonslearnedService,
    public dialog: MatDialog
    ) { }


  ngOnInit() {



      this.getdataMeeting();

  }


  
  getdataMeeting() {

      this.loadData = true;

      this.lessonsService.getDataMeeting(localStorage.getItem('project'))
        .subscribe((resp: any) => {
          /*=============================================
        Integrando respuesta de base de datos con la interfaz
        =============================================*/
          let numberposition = 1;

          this.meeting = Object.keys(resp).map(
            (a) =>
              ({
                 id: a,
                 numberposition : numberposition++,
                 active         : 1,
                 details        : resp[a].details,
                 typemeeting    : resp[a].typemeeting,
                 place          : resp[a].place,
                 datep          : resp[a].datep,
                 timep          : resp[a].timep,
                 id_project     : resp[a].id_project,
                 file           : resp[a].file
              } as Ilessons)
          );

        //    console.log(this.lessons) ;
             this.profile = this.meeting[this.currentIndex]; // Tomamos el primer registro

             this.fileUrl = this.profile.file ;
             this.lessonsDataSource = new MatTableDataSource(this.meeting); // Creamos el dataSource
             this.lessonsDataSource.paginator = this.paginator ;
             this.lessonsDataSource.sort = this.sort;

            this.loadData = false;
        });
    }


    getdataLessonsl() {

      this.loadData = true;

      this.lessonslearnedService.getDataLearned(this.trackingService.getidlesson())
        .subscribe((resp: any) => {
          /*=============================================
        Integrando respuesta de base de datos con la interfaz
        =============================================*/
          let numberposition = 1;

          this.lessonsl = Object.keys(resp).map(
            (a) =>
              ({
                 id: a,
                 numberposition : numberposition++,
                 active         : 1,
                 people         : resp[a].people,
                 concept        : resp[a].concept,
                 reference      : resp[a].reference,
                 stage          : resp[a].stage,
                 phase          : resp[a].phase,
                 procces        : resp[a].procces,
                 technology     : resp[a].technology,
                 event          : resp[a].event,
                 evidenced      : resp[a].evidenced,
                 id_lesson      : resp[a].id_lesson,
                 lessonlearned  : resp[a].lessonlearned,
                 consequencen   : resp[a].consequencen,
                 consequencep   : resp[a].consequencep,
                 actionspavoid  : resp[a].actionspavoid,
                 signed         : resp[a].signed
              } as Ilearned)
          );

           //   this.profile = this.lessonsl[this.currentIndex]; // Tomamos el primer registro
           //  this.fileUrl = this.profile.file ;

             this.learnedDataSource = new MatTableDataSource(this.lessonsl); // Creamos el dataSource
             this.learnedDataSource.paginator = this.paginator ;
             this.learnedDataSource.sort = this.sort;

            this.loadData = false;
        });
    }


  getDatafindLessons(){

  }


  showProfile(commun: Ilessons) {
    // Actualizamos el currentIndex y el profile
    this.profile = commun;
    this.trackingService.setidlesson( this.profile.id) ;

  }



  newLessons(formType: string) {
    const dialogRef = this.dialog.open(NewlessComponent, { data: { formType: formType } });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        this.getdataMeeting();
      }
    });

  }


  newLearned(formType: string) {
    const dialogRef = this.dialog.open(NewlessComponent, { data: { formType: formType } });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        this.getdataMeeting();
      }
    });

  }


  editLessons(id: string) {

  }



  deleteLessons(id : string) {

    alerts.confirmAlert('Are you sure?', 'The information cannot be recovered!', 'warning','Yes, delete it!')
    .then((result) => {

  if (result.isConfirmed) {
        this.lessonsService.findDetails(id).subscribe(

             (resp:any) => {

              if (Object.keys(resp).length > 0) {
                    alerts.basicAlert('error', "The lessons has Interested", "error")
              } else {

                this.lessonsService.deleteLessons(id, localStorage.getItem('token'))

                .subscribe(
                  () => {

                      alerts.basicAlert("Sucess", "The user has been deleted", "success")

                      this.getdataMeeting();
                  }
                )
              }

           }
       )
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


  openLink(url: string) {
    // este es el ultimo cambio que subi
    window.open(url, '_blank');
  }


  reporteOne(){

  }

  reporteAll() {

  }


}

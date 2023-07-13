import { Component, OnInit, ViewChild } from '@angular/core';

import { TraductorService } from 'src/app/services/traductor.service';
import { TrackingService } from 'src/app/services/tracking.service';

import { Ilessons } from 'src/app/interface/ilessons';

import { LessonsService } from 'src/app/services/lessons.service';
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
  selectedTab = 'lessons';
  profile: any = {};

  onTabSelected(tabName: string) {
    this.selectedTab = tabName;

    if (tabName === 'lessons') {
      this.trackingService.addLog(
         this.trackingService.getnameComp(),
        'Click en la Pestaña Details/Detalles del menu Conceptos',
        'Conceptos',
        this.trackingService.getEmail()
      );
      this.getDataLessons();
    }

    if (tabName === 'personal') {
      this.trackingService.addLog(
        this.trackingService.getnameComp(),
        'Click en la Pestaña Personal del menu Conceptos',
        'Conceptos',
        this.trackingService.getEmail()

      );

      this.getDatafindLessons()
    }
  }

  lessonsDataSource!   : MatTableDataSource<Ilessons>;

  lessons : Ilessons[] = [] ;

  screenSizeSM = false;

  fileUrl : string ;
  currentIndex: number = 0;

  loadData     = false;

  displayedColessons: string[] = [
    'numberposition',
    'type',
    'place',
    'date',
    'time',
    'actions',
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private trackingService: TrackingService,
    private translateService    : TraductorService,
    private lessonsService      : LessonsService,
    private dialog: MatDialog
    ) { }


  ngOnInit() {
    this.getDataLessons();
  }



  getDataLessons() {

      this.loadData = true;

      this.lessonsService.getDataLessons(localStorage.getItem('project'))
        .subscribe((resp: any) => {
          /*=============================================
        Integrando respuesta de base de datos con la interfaz
        =============================================*/
          let numberposition = 1;

          this.lessons = Object.keys(resp).map(
            (a) =>
              ({
                 id: resp[a].key,
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

            console.log(this.lessons) ;
            this.profile = this.lessons[this.currentIndex]; // Tomamos el primer registro
            this.fileUrl = this.profile.file ;
            this.lessonsDataSource = new MatTableDataSource(this.lessons); // Creamos el dataSource
            this.lessonsDataSource.paginator = this.paginator ;
            this.lessonsDataSource.sort = this.sort;

           this.loadData = false;
        });
    }


  getDatafindLessons(){

  }


  showProfile(commun: Ilessons) {
    // Actualizamos el currentIndex y el profile
    this.profile = commun;
  }



  newLessons(formType: string) {
    const dialogRef = this.dialog.open(NewlessComponent, { data: { formType: formType } });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getDataLessons();
      }
    });

  }



  editLessons(id: string) {

  }



  deleteLessons(id : string) {

    console.log("ID", id)

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

                      this.getDataLessons();
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

}

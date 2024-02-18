import { Component, OnInit, Inject, AfterViewInit, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';


import { ResguardService } from 'src/app/services/resguard.service';
import { TrackingService } from 'src/app/services/tracking.service';
import { MaterialsService } from 'src/app/services/materials.service';

import { Iresguard } from 'src/app/interface/iresguard';
import { Iitemsmat } from 'src/app/interface/iitemsmat';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { alerts } from 'src/app/helpers/alerts';


@Component({
  selector: 'app-resguards',
  templateUrl: './resguards.component.html',
  styleUrls: ['./resguards.component.css']
})
export class ResguardsComponent implements OnInit {
   @ViewChild('numdocInput', { static: false }) numdocInput: ElementRef;  // Obtén una referencia al input con #numdocInput

   selection = new SelectionModel<Iresguard>(true, []);

  showNewResg     : boolean = false ;
  showNewMat      : boolean = false ;
  showGridResg    : boolean = true ;
  showGridMat     : boolean = true ;
  isDataAvailable : boolean = false ;


  idResguardo : number = 0 ;

  resguardDataSource !: MatTableDataSource<Iresguard>;
  itemsDataSource    !: MatTableDataSource<Iitemsmat>;

  screenSizeSM = false;
  resguards : Iresguard[] = [];
  items     : Iitemsmat[] = [] ;
  materials :  any[] = [] ;

  loadData      = false ;
  loadMaterials = false ;

  displayedColresguards : string[] = ['numberposition', 'number', 'date',  'actions'];
  displayedColitems     : string[] = ['numberposition', 'material', 'quantity',  'actions'];


@ViewChild(MatPaginator) paginator: MatPaginator;
@ViewChild(MatSort) sort!: MatSort;

  constructor(
        private formBuilder   : FormBuilder,
        private resguardServ : ResguardService,
        private materialsServ : MaterialsService,
        private trackingServ  : TrackingService,

  ) { }


  public fresg = this.formBuilder.group({
    idEmp     : 0,
    Date      : new FormControl(new Date().toISOString().substring(0, 10)), // Formato YYYY-MM-DD
    numdoc    : [''],
    comment   : ['']
  });

  public fmat = this.formBuilder.group({
    quantity : [],
    cc       : [''],
    numero   : [''],
    mat      : 0,
    sale     : []
  });


    // Function to check if all rows are selected
    isAllSelected() {
      const numSelected = this.selection.selected.length;
      const numRows = this.resguards.length;
      return numSelected === numRows;
    }

    // Function to toggle the selection for all rows
    masterToggle() {
      this.isAllSelected() ?
        this.selection.clear() :
        this.resguards.forEach(row => this.selection.select(row));
    }

  ngOnInit() {
    this.fresg = this.formBuilder.group({
      idEmp   : 0,
      Date    : new FormControl(new Date().toISOString().substring(0, 10)),
      numdoc  : [''],
      comment : ['']
    });

    this.getDataResguards() ;
  }



  newResg(){

  }

  showResg() {
    this.showGridResg = true;
    this.showNewResg = true ;
    this.showGridMat = false;
  }


  showMat() {
    this.get2Mat();
    this.showNewMat = true;
    this.showGridMat = false;
  }

  Cancel() {
     this.showNewResg  = false;
     this.showGridResg = true;
     this.showGridMat  = true ;
  }

  CancelMat() {
    this.showNewMat  = false;
    this.showGridMat = true;
 }

  updateIsDataAvailable() {
    this.isDataAvailable = this.resguards.length > 0;

     // If there is data, check if there is valid data in getMaterials for each record
    if (this.isDataAvailable) {
      this.checkGetMaterialsValidity();
    }
  }

  assignval( nd: string, fe : Date, com : string) {
     this.trackingServ.setfecha(fe);
     this.trackingServ.setnumRes(nd) ;
     this.trackingServ.setCommen(com) ;
  }

  getMaterials(id:number, nd: string, fe : Date, com : string) {
     this.assignval(nd, fe, com ) ;
    this.showGridMat   = true;
    this.idResguardo   = id ;
    this.loadMaterials = true;
    this.resguardServ.getItems(id)
      .subscribe((resp: any) => {
        /*=============================================
      Integrando respuesta de base de datos con la interfaz
      =============================================*/
        let numberposition = 1;

        this.items = Object.keys(resp).map(
          (a) =>
            ({
               id             : resp[a].id,
               idResguardo    : resp[a].idResguardo,
               sales          : resp[a]?.sales,
               quantity       : resp[a]?.quantity,
               descmat        : resp[a]?.descmat,
               numberposition : numberposition++

            } as Iitemsmat)

        );
           this.itemsDataSource           = new MatTableDataSource(this.items)
           this.itemsDataSource.paginator = this.paginator ;
           this.itemsDataSource.sort      = this.sort;
           this.loadMaterials             = false;
      });
  }



  checkGetMaterialsValidity() {
    // Iterate through each record in resguards and check if getMaterials returns data
    for (const resguard of this.resguards) {
      this.resguardServ.getItems(resguard.id)
        .subscribe((resp: any) => {
          const items = Object.keys(resp).map(
            (a) =>
              ({
                idResguardo   : resp[a].idResguardo,
                sales          : resp[a]?.sales,
                quantity       : resp[a]?.quantity,
                descmat        : resp[a]?.descmat,
              } as Iitemsmat)
          );

          // Update the validity flag for each record
          resguard.isValidGetMaterials = items.length > 0;
        });
    }
  }

  getDataResguards() {
    this.loadData = true;

    this.resguardServ.getResg(this.trackingServ.getidEmp())
      .subscribe((resp: any) => {
        /*=============================================
      Integrando respuesta de base de datos con la interfaz
      =============================================*/
        let numberposition = 1;

        this.resguards = Object.keys(resp).map(
          (a) =>
            ({
               id             : resp[a].id,
               idEmp          : resp[a]?.idEmp,
               date           : resp[a]?.date,
               numdoc         : resp[a]?.numdocument,
               comment        : resp[a]?.comment,
               numberposition : numberposition++
             } as Iresguard)
        );
           this.resguardDataSource           = new MatTableDataSource(this.resguards)
           this.resguardDataSource.paginator = this.paginator ;
           this.resguardDataSource.sort      = this.sort;
           this.loadData = false;

           // Check if data is available
           this.updateIsDataAvailable() ;
      });

  }


  saveRes() {
    this.loadData = true;

     const dataResguard: Iresguard = {
        idEmployee  : Number(this.trackingServ.getidEmp()),
        date        : new Date(this.fresg.get('Date').value),
        numdocument : this.fresg.get('numdoc')?.value,
        comment     : this.fresg.get('comment')?.value
      }
         this.loadData = false;

     //    console.log('dataResguard', dataResguard);

         this.resguardServ.postRes(dataResguard, localStorage.getItem('token')).subscribe(
          (resp: any) => { // Indicar que la respuesta es de tipo 'any'
              alerts.basicAlert('Ok', 'The Resguard has been saved', 'success');
              this.getDataResguards() ;
              this.Cancel() // Hide the form after submission
            },
                err=>{
                       alerts.basicAlert("Error", 'Resguard saving error', "error")
                }
         );
  }


  saveMat(){

    const dataItems: Iitemsmat = {
      //  id           : 0,
        cc           : this.fmat.get('cc')?.value,
        idResguardo  : this.idResguardo,
        idSupplies   : this.fmat.get('mat')?.value,
        noctrl       : this.fmat.get('numero')?.value,
        quantity     : this.fmat.get('quantity')?.value,
        sales        : this.fmat.get('sale')?.value
      }
     //    console.log('dataItems', dataItems);

         this.resguardServ.postItem(dataItems, localStorage.getItem('token')).subscribe(
          (resp: any) => { // Indicar que la respuesta es de tipo 'any'
              alerts.basicAlert('Ok', 'The Item has been saved', 'success');
              this.getMaterials(this.idResguardo, '', new Date(), '') ;
            },
                err=>{
                       alerts.basicAlert("Error", 'Resguard saving error', "error")
                }
         );
  }

  deleteResg(id: string) {

    alerts.confirmAlert('Are you sure?', 'The information cannot be recovered!', 'warning','Yes, delete it!')
    .then((result) => {

        if (result.isConfirmed) {

          this.resguardServ.deleteResguard(id, localStorage.getItem('token'))
          .subscribe( () => {

              alerts.basicAlert("Sucess", "The Resguard has been deleted", "success")

              this.getDataResguards() ;
            })
          }
    })
  }


  deleteItem(id: number) {

    alerts.confirmAlert('Are you sure?', 'The information cannot be recovered!', 'warning','Yes, delete it!')
    .then((result) => {

        if (result.isConfirmed) {

          this.resguardServ.deleteItem(id, localStorage.getItem('token'))
          .subscribe( () => {

              alerts.basicAlert("Sucess", "The Item has been deleted", "success")
              this.getMaterials(this.idResguardo, '', new Date(), '') ;

              this.getDataResguards() ;
            })
          }
    })
  }


  get2Mat() {
    this.materialsServ.getSupplies2f(localStorage.getItem('company')).subscribe((me) => {
      this.materials = Object.values(me);
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


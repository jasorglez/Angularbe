import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Ipurchaseorder } from 'src/app/interface/purchaseorder';
import { PoService } from 'src/app/services/po.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TrackingService } from 'src/app/services/tracking.service';
import { alerts } from 'src/app/helpers/alerts';
import { MatDialog } from '@angular/material/dialog';
import { ReusableComponent } from '../../reusable/reusable.component';

@Component({
  selector: 'app-oc',
  templateUrl: './oc.component.html',
  styleUrls: ['./oc.component.css']
})
export class OcComponent implements OnInit {

  ocDataSource!  : MatTableDataSource<Ipurchaseorder> ;
  currentIndex: number = 0;

  screenSizeSM = false;

  providers    : Ipurchaseorder[] = [] ;

  loadData     = false;

  displayedColOc: string[] = [
     'number', 'date', 'currency', 'Status', 'actions'];

    oc : Ipurchaseorder[] = [];

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;


  constructor( private ordersService : PoService,
               private trackingServ  : TrackingService,
               public dialog: MatDialog) { }

  ngOnInit() {

     this.getDataOc()
  }

  showDetail(id : number) {

  }

  getDataOc() {
    this.loadData = true;

    this.ordersService.getData(localStorage.getItem('company'), this.trackingServ.getnumpro())
      .subscribe((resp: any) => {
        /*=============================================
      InteglocalStorage.getItem('company'), 1ando respuesta de base de datos con la interfaz
      =============================================*/
        let numberposition = 1;

        this.oc = Object.keys(resp).map(
          (a) =>
            ({
               id             : resp[a].id,
               numorder       : resp[a].numorder,
               date           : resp[a]?.date,
               status         : resp[a].status,
               conditions     : resp[a]?.conditions,
               desCurr        : resp[a]?.descCurr
             } as Ipurchaseorder)
        );
           this.ocDataSource           = new MatTableDataSource(this.oc)
           this.ocDataSource.paginator = this.paginator ;
           this.ocDataSource.sort      = this.sort;
           this.loadData = false;

      });

  }

  newOc () {
    const dialogRef = this.dialog.open(ReusableComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        alerts.confirmAlert('Se realizo el registro correctamente', 'Register new Ok', 'success', 'Ok').then((result) => {
       //   this.getDataEmployees() ;
        });
      }
    });

  }


  editOc (id : string){


  }

  deleteOc(id : string){


  }

  applyFilter(dataSource: MatTableDataSource<any>, event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    dataSource.filter = filterValue.trim().toLowerCase();

    if (dataSource.paginator) {
      dataSource.paginator.firstPage();
    }
  }


}

import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Ipurchaseorder } from 'src/app/interface/purchaseorder';


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
    'numberposition',  'name', 'mail',  'actions'];

    oc : Ipurchaseorder[] = [];


  constructor() { }

  ngOnInit() {

     this.getDataOc()
  }


  getDataOc() {
    this.loadData = true;

    this.resguardServ.getResg(this.trackingServ.getidEmp())
      .subscribe((resp: any) => {
        /*=============================================
      Integrando respuesta de base de datos con la interfaz
      =============================================*/
        let numberposition = 1;

        this.oc = Object.keys(resp).map(
          (a) =>
            ({
               id             : resp[a].id,
               numorder       : resp[a].num_orden,
               date           : resp[a]?.date,
               id_provider    : 0,
               delivery       : resp[a]?.delivery,
               deliverytime   : resp[a]?.comment,
               datedelivery   : resp[a]?.comment,
               id_pay         : 0,
               id_currency    : 0,
               conditions     : resp[a]?.conditions,
               adressend      : '',
               phonesend      : '',
               id_request     : 0,
               id_authorizes  : 0,
               numberposition : numberposition++
             } as Ipurchaseorder)
        );
           this.ocDataSource           = new MatTableDataSource(this.oc)
           this.ocDataSource.paginator = this.paginator ;
           this.ocDataSource.sort      = this.sort;
           this.loadData = false;


      });

  }

  newOc () {

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

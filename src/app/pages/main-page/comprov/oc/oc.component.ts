import { Component, OnInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { Ipurchaseorder } from 'src/app/interface/purchaseorder';
import { Imatxpo } from 'src/app/interface/imatxpo';

import { PoService } from 'src/app/services/po.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { TrackingService } from 'src/app/services/tracking.service';
import { MaterialsService } from 'src/app/services/materials.service';

import { ProvidersService } from 'src/app/services/providers.service';
import { CatalogService } from 'src/app/services/catalog.service';
import { UsersService } from 'src/app/services/users.service';

import { alerts } from 'src/app/helpers/alerts';
import { MatDialog } from '@angular/material/dialog';
import { ReusableComponent } from '../../reusable/reusable.component';

import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-oc',
  templateUrl: './oc.component.html',
  styleUrls: ['./oc.component.css']
})
export class OcComponent implements OnInit {
   @ViewChild('dateInput', { static: false }) dateInput: ElementRef;

  showGridOc      : boolean = true ;
  showGridOcxMat  : boolean = true ;
  existedata      : boolean = false ;

  showNewOc       : boolean = false ;
  showNewMat      : boolean = false ;

  idPo : number = 0 ;

  ocDataSource!    : MatTableDataSource<Ipurchaseorder> ;
  itemsDataSource! : MatTableDataSource<Imatxpo> ;

  currentIndex: number = 0;

  screenSizeSM = false;

  providers    : Ipurchaseorder[] = [] ;

  loadData      = false ;
  loadMaterials = false ;

  isDataAvailable : boolean = false ;

  displayedColOc: string[] = [
     'number', 'date', 'currency', 'Status', 'actions'];

  displayedColitems: string[] = ['material', 'quantity', 'sales', 'actions'];

    oc            : Ipurchaseorder[] = [];
    listmaterials : any[] = []  ;
    listProviders : any[] =  [] ;
    listMoneys    : any[] =  [] ;
    listCurrency  : any[] =  [] ;
    listusuReq    : any[] =  [] ;
    listusuAuth   : any[] =  [] ;
    items         : Imatxpo[] = [] ;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    public fOc = this.formBuilder.group({
      numoc      :[''],
      delivery   : [''],
      delivtime  : [''],
      idMp       : 0,
      idTc       : 0,
      date       : new FormControl(new Date().toISOString().substring(0, 10)), // Formato YYYY-MM-DD
   // Aumentar 2 días a la fecha de entrega
      dated: new FormControl(new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10)),
      conditions : [''],
      comment    : [''],
      adresssend : [''],
      citysend   : [''],
      phonesend  : [''],
      aut        : 0,
      req        : 0
    });


    public fOcxmat = this.formBuilder.group({
       idMat      : 0,
       quantity   : [],
       price      : [],
       delivery   : 0,
       pendent    : 0,
       total      : 0,
       comment    :['']
    });


  constructor( private ordersService : PoService,
               private trackingServ  : TrackingService,
               private materialsServ       : MaterialsService,
               private provServ      : ProvidersService,
               private catalServ     : CatalogService,
               private userServ      : UsersService,
               private formBuilder   : FormBuilder,
               public dialog: MatDialog,
               private renderer: Renderer2 ) { }


  ngOnInit() {

     this.getDataOcxProv()

  }


  showDetail(element : string) {

  }

  showOc() {
    this.showGridOc     = false ;
    this.showGridOcxMat = false;
    this.showNewOc      = true ;
  }

  Cancel() {
    this.showNewOc   = false;
    this.showGridOc  = true;
    this.showGridOcxMat = true ;
  }

  cancelDet() {
    this.showNewMat     = false;
    this.showGridOc     = true;
    this.showGridOcxMat = true ;
  }

  showDetMat() {
    this.get2Mat();
    this.showNewMat     = true ;
    this.showGridOcxMat = true;
  }


  updateIsDataAvailable() {
    this.isDataAvailable = this.oc.length > 0;

     // If there is data, check if there is valid data in getMaterials for each record
    if (this.isDataAvailable) {
      this.checkGetMaterialsValidity();
    }
  }


  newOc () {

     this.showOc() ;
   setTimeout(() => {
    if (this.dateInput && this.dateInput.nativeElement) {
      this.dateInput.nativeElement.focus();
    }
  });
     this.getDataMethods()  ;
     this.getDataCurrency() ;
     this.getDataNoAut()    ;
     this.getDataAut()      ;
  }


  getDataMethods() {
    this.catalServ.getdataPaymentmet().subscribe((mp) => {
      this.listMoneys = Object.values(mp);
    })
  }

  getDataCurrency() {
    this.catalServ.getdataTypecurrency().subscribe((me) => {
      this.listCurrency = Object.values(me);
    })
  }

  getDataNoAut() {
    this.userServ.getdataUserNoAut().subscribe((us) => {
      this.listusuReq = Object.values(us);
    })
  }


   getDataAut() {
    this.userServ.getdataUserAut().subscribe((us) => {
      this.listusuAuth = Object.values(us);
    })
   }

   getMaterials(id:number) {
   // console.log("ID get materials", id);
    this.showGridOcxMat   = true;
    this.idPo   = id ;

   this.loadMaterials = true;
   this.ordersService.getDataMat(id)
     .subscribe((resp: any) => {
       /*=============================================
     Integrando respuesta de base de datos con la interfaz
     =============================================*/
       let numberposition = 1;

       this.items = Object.keys(resp).map(
         (a) =>
           ({
              id          : resp[a].id,
              idPo        : resp[a].idPo,
              Sales       : resp[a]?.sales,
              Quantity    : resp[a]?.quantity,
              descmat     : resp[a]?.descmat,
           } as Imatxpo)
       );

          //console.log("DATA", this.items);
          this.itemsDataSource           = new MatTableDataSource(this.items)
          this.itemsDataSource.paginator = this.paginator ;
          this.itemsDataSource.sort      = this.sort;
          this.loadMaterials             = false;
     });
 }

   checkGetMaterialsValidity() {

    // Iterate through each record in resguards and check if getMaterials returns data
    for (const oc of this.oc) {

      this.ordersService.getDataMat(oc.id)
        .subscribe((resp: any) => {
          const items = Object.keys(resp).map(
            (a) =>
              ({
                 id          : resp[a].id,
                 idPo        : resp[a].idPo,
                 Sales       : resp[a]?.sales,
                 Quantity    : resp[a]?.quantity,
                 descmat     : resp[a]?.descmat,
              } as Imatxpo)
          );
          // Update the validity flag for each record
          oc.isValidGetMaterials = items.length > 0;
        });
    }
  }

  getDataOcxProv() {
    this.loadData = true;

    this.ordersService.getData(localStorage.getItem('company'), this.trackingServ.getnumpro())
      .subscribe((resp: any) => {

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
           // console.log('OC', this.oc)
           this.ocDataSource           = new MatTableDataSource(this.oc)
           this.ocDataSource.paginator = this.paginator ;
           this.ocDataSource.sort      = this.sort;
           this.loadData = false;

           // Check if data is available
           this.updateIsDataAvailable() ;
      });

  }


  SaveOc() {
    this.loadData = true;

     const dataOc  : Ipurchaseorder = {
        numorder     : this.fOc.get('numoc')?.value ,
        date         : new Date(this.fOc.get('date').value),
        idProvider   : this.trackingServ.getnumpro(),
        idCompany    : localStorage.getItem('company'),
        delivery     : this.fOc.get('delivery')?.value ,
        deliverytime : this.fOc.get('delivtime')?.value ,
        datedelivery : new Date(this.fOc.get('dated').value) ,
        idPay       : Number(this.fOc.get( 'idMp').value) ,
        idCurrency  : Number(this.fOc.get( 'idTc').value) ,
        conditions   : this.fOc.get('conditions')?.value,
        comment      : this.fOc.get('comment')?.value,
        adresssend   : this.fOc.get('adresssend')?.value,
        citysend     : this.fOc.get('citysend')?.value,
        phonesend    : this.fOc.get( 'phonesend' )?.value,
        status       : 'PENDIENTE',
        idAuthorizes : Number(this.fOc.get( 'aut' ).value) ,
        idRequest    : Number(this.fOc.get( 'req' ).value) ,

      }
         this.loadData = false;

        // console.log('dataOC', dataOc);

         this.ordersService.post(dataOc, localStorage.getItem('token')).subscribe(
          (resp: any) => { // Indicar que la respuesta es de tipo 'any'
              alerts.basicAlert('Ok', 'The OC has been saved', 'success');
              this.getDataOcxProv() ;
              this.Cancel() // Hide the form after submission
            },
                err=>{
                       alerts.basicAlert("Error", 'OC saving error', "error")
                }
         );
  }

  
  saveDet() {
    this.showNewMat = false;
  
    const dataItems: Imatxpo = {
      idPo: this.idPo,
      idSupplies: this.fOcxmat.get('idMat')?.value,
      Quantity: this.fOcxmat.get('quantity')?.value,
      Sales: this.fOcxmat.get('price')?.value,
      Comment: this.fOcxmat.get('comment')?.value
    };
  
    // Check if the material already exists
    this.ordersService.materialExistence(this.idPo, dataItems.idSupplies)
      .subscribe(
        (result: any) => {
          // Material already exists, prompt the user using your custom alerts library
          alerts.confirmAlert('Are you sure?', 'Material already exists. Do you want to update the quantity?', 'warning', 'Yes, update it!')
           .then(userResponse => {
               if (userResponse.isConfirmed) {
                   // User confirmed, update the quantity
                  this.ordersService.updateMaterial(result.id, dataItems.Quantity).subscribe(
                    () => {
                      // Success
                      alerts.basicAlert("Sucess", "Quantity updated successfully", "success")
                      this.getMaterials(this.idPo);
                    },
                    error => {
                      console.error('Error updating quantity:', error);
                    }
                  );
                } else {
                  // User canceled, provide feedback to the user
                  alerts.basicAlert("Error", "User cancelled updated", "error")
                  // Optionally, you can display a message to the user here
                }
            });
        },
        error => {
          //console.error('Error checking material existence:', error);
          // Material does not exist, proceed with adding a new one
          this.saveNewMaterial(dataItems);
        }
      );
  }
  




  saveNewMaterial(dataItems: Imatxpo) {
    // Save a new record
    this.ordersService.postMat(dataItems, localStorage.getItem('token')).subscribe(
      (resp: any) => {
        alerts.basicAlert('Ok', 'The Item has been saved', 'success');
        this.getMaterials(this.idPo);
      },
      err => {
        alerts.basicAlert('Error', 'Error saving material', 'error');
      }
    );
  }



  edit (id : string){


  }

  deletePo(id: string) {

    alerts.confirmAlert('Are you sure?', 'The information cannot be recovered!', 'warning','Yes, delete it!')
    .then((result) => {

        if (result.isConfirmed) {

          this.ordersService.delete(id, localStorage.getItem('token'))
          .subscribe( () => {

              alerts.basicAlert("Sucess", "The OC has been deleted", "success")

              this.getDataOcxProv()
            })
          }
    })
  }



 

  deleteMat(id: string) {

    alerts.confirmAlert('Are you sure?', 'The information cannot be recovered!', 'warning','Yes, delete it!')
    .then((result) => {

        if (result.isConfirmed) {

          this.ordersService.deleteItem(id, localStorage.getItem('token'))
          .subscribe( () => {

              alerts.basicAlert("Sucess", "The Item has been deleted", "success")
              this.getMaterials(this.idPo) ;

              this.getDataOcxProv()
            })
          }
    })
  }


  get2Mat() {
    this.materialsServ.getSupplies2f(localStorage.getItem('company')).subscribe((me) => {
      this.listmaterials = Object.values(me);
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

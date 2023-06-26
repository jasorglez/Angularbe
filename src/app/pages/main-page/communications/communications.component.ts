import { Component, OnInit, ViewChild } from '@angular/core';

import { Icommunications } from 'src/app/interface/icommunication';
import { Idetailscom } from 'src/app/interface/idetailscom';

import { TraductorService } from 'src/app/services/traductor.service';
import { TrackingService } from 'src/app/services/tracking.service';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

import { functions } from 'src/app/helpers/functions';

import { alerts } from 'src/app/helpers/alerts';

import { CommunicationsService } from 'src/app/services/communications.service';
import { NewcommunicComponent } from './newcommunic/newcommunic.component';

import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-communications',
  templateUrl: './communications.component.html',
  styleUrls: ['./communications.component.css'],
})
export class CommunicationsComponent implements OnInit {
  selectedTab = 'comunication';
  isGeneratingPDF: boolean;

  pdfMake: any;

  fecha          : string;
  descripcion    : string;
  archivos       : File[] = [];
  interesados    : string[] = [];
  interestedList : any[] = [];

  onTabSelected(tabName: string) {
    this.selectedTab = tabName;

    if (tabName === 'details') {
      this.trackingService.addLog(
        '',
        'Click en la Pestaña Details/Detalles del menu Communications',
        'Communications',
        ''
      );
      this.getdatafindDetail();
    }

    if (tabName === 'documents') {
      this.trackingService.addLog(
        '',
        'Click en la Pestaña Documents del menu Communications',
        'Communications',
        ''

      );

      this.getCommunicint()
    }
  }

  comDataSource!: MatTableDataSource<Icommunications>; //Variable global que instancie la data que aparecerá en la Tabla
  detailsDataSource: MatTableDataSource<Idetailscom>;

  comunications: Icommunications[] = [];
  detailscom: Idetailscom[] = [];

  detailscom2: Idetailscom[] = [];

  profile: any = {};

  loadData = false;
  loadData2 = false;

  screenSizeSM = false;
  currentIndex: number = 0;

  //  Variable para nombrar las columnas de nuestra tabla en Angular Material
  displayedColumns: string[] = [
    'numberposition',
    'procces',
    'information',
    'owner',
    'actions',
  ];

  // para mostrar columnas de detalles
  displayedColdetails: string[] = ['numberposition', 'name', 'actions'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private trackingService: TrackingService,
    private communicationsService: CommunicationsService,
    public translateService: TraductorService,
    public http : HttpClient,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {

        this.getdataComunications();

        /*=============================================
        Definir tamaños de pantalla
        =============================================*/
        if (functions.screenSize(0, 767)) {
          this.screenSizeSM = true;
        } else {
          this.screenSizeSM = false;
        }

       this.getdataallDetails() ;

  }

  showProfile(commun: Icommunications) {
    // Actualizamos el currentIndex y el profile
    this.profile = commun;
  }


  getdataComunications() {
    this.loadData = true;

    this.communicationsService.getDataCommunications(this.trackingService.getProject())
      .subscribe((resp: any) => {
        /*=============================================
      Integrando respuesta de base de datos con la interfaz
      =============================================*/
        let numberposition = 1;

        this.comunications = Object.keys(resp).map(
          (a) =>
            ({
              id: a,
              numberposition : numberposition++,
              active         : resp[a].active,
              name           : resp[a].name,
              procces        : resp[a].procces,
              information    : resp[a].information,
              format         : resp[a].format,
              area           : resp[a].area,
              owner          : resp[a].owner,
              reference      : resp[a].reference,
              frequence      : resp[a].frequence,
              group          : resp[a].group,
              id_project     : ''
            } as Icommunications)
        );

         this.profile = this.comunications[this.currentIndex]; // Tomamos el primer registro
        this.comDataSource = new MatTableDataSource(this.comunications); // Creamos el dataSource
        this.comDataSource.paginator = this.paginator;
        this.comDataSource.sort = this.sort;
        this.loadData = false;
      });
  }

  getdataallDetails() {
    this.loadData = true;

    this.communicationsService.getDataCommunicationsdetail()
      .subscribe((resp: any) => {
        /*=============================================
      Integrando respuesta de base de datos con la interfaz
      =============================================*/
        let numberposition = 1;

        this.detailscom2 = Object.keys(resp).map(
          (a) =>
            ({
                 id: resp[a].id,
                 active: resp[a].active,
                 name: resp[a].name,
            } as Idetailscom)
        );

      });
  }


  getdatafindDetail() {
    this.loadData2 = true;

    this.communicationsService.buscarSubdetalle(this.profile.id)
      .subscribe((resp: any) => {
        /*=============================================
    Integrando respuesta de base de datos con la interfaz
    =============================================*/
        let numberposition = 1;

        this.detailscom = Object.keys(resp).map(
          (a) =>
            ({
              id: resp[a].id,
              numberposition: numberposition++,
              active: resp[a].active,
              name: resp[a].name,
            } as Idetailscom)
        );

        //console.log('details', this.detailscom);
        // Creamos el dataSource
        this.detailsDataSource = new MatTableDataSource(this.detailscom);
        this.detailsDataSource.paginator = this.paginator;
        this.detailsDataSource.sort = this.sort;
        this.loadData2 = false;
      });
  }

  newCommunications() {
    const dialogRef = this.dialog.open(NewcommunicComponent, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getdataComunications();
      }
    });

  }

  editCommunic(id: string) {}

  editDetails(id: string) {}



  deleteCommunic(id: string) {
      alerts.confirmAlert('Are you sure?', 'The information cannot be recovered!', 'warning','Yes, delete it!')
        .then((result) => {

      if (result.isConfirmed) {
            this.communicationsService.buscarSubdetalle(id).

              subscribe(

                 (resp:any) => {

                  if (Object.keys(resp).length > 0) {
                        alerts.basicAlert('error', "The communication has related permission", "error")
                  } else {

                    this.communicationsService.deleteCommunications(id, localStorage.getItem('token'))

                    .subscribe(
                      () => {

                          alerts.basicAlert("Sucess", "The user has been deleted", "success")

                          this.getdataComunications();
                      }
                    )
                  }

               }
           )
      }
    })
  }


  deleteDetails(id: string, name: string) {

    alerts.confirmAlert('Are you sure?', 'The information cannot be recovered!', 'warning','Yes, delete it!')
     .then((result) => {

       if (result.isConfirmed) {

              const index = this.detailscom.findIndex(item => item.name === name);

              if (index !== -1) {
                    const idBorrar = this.detailscom[index].id;
                    // Eliminar el elemento del arreglo
                    this.detailscom.splice(index, 1);

                    // Actualiza el dataSource
                    this.detailsDataSource = new MatTableDataSource(this.detailscom);
                    this.detailsDataSource.paginator = this.paginator;
                    this.detailsDataSource.sort = this.sort;

                   // Eliminar el dato de la base de datos Firebase
                              this.http.get('https://beapp-501d1-default-rtdb.firebaseio.com/details_communications.json')
                              .subscribe((resp: any) => {
                                const keys = Object.keys(resp);
                                for (const key of keys) {
                                  if (resp[key].id === idBorrar && resp[key].name === name) {
                                    this.http.delete(`https://beapp-501d1-default-rtdb.firebaseio.com/details_communications/${key}.json`)
                                      .subscribe(
                                        () => {
                                          console.log('Dato borrado exitosamente de la base de datos Firebase.');
                                        },
                                        (error) => {
                                          console.error('Error al borrar el dato de la base de datos Firebase:', error);
                                        }
                                      );
                                    break;
                                  }
                                }
                              });
                          }
              else
              {
                console.log('No se encontró el elemento con el nombre proporcionado.');
              }
            }


        });

  }


  detailsdata() {}


  generarReporte() {
    // Obtener los detalles de comunicaciones únicos
    const uniqueDetails = this.detailscom2;
    const uniqueDetailNames = [...new Set(uniqueDetails.map(detail => detail.name))].sort();

    // Crear o armar la cabecera la fila de encabezados
    const headerRow = [
      'procces',
      'information',
      'format',
      'owner',
      'reference',
      'frequence',
      'group',
      ...uniqueDetailNames.map(name => ({ text: name, rotation: 90 }))
    ];

   // Crear las filas de datos
  const dataRows = this.comunications.map(com => {
  const details = this.detailscom2.filter(detail => detail.id === com.id);

  const row = [
    com.procces,
    com.information,
    com.format,
    com.owner,
    com.reference,
    com.frequence,
    com.group
  ];

  uniqueDetailNames.forEach(name => {
    const interactionNames = details.some(detail => detail.name === name) ? 'X' : '';
    row.push(interactionNames);
  });

  return row;
});

console.log("Rows", dataRows);

    const documentDefinition = {
      content: [
        {
          table: {
            headerRows: 1,
            widths: new Array(headerRow.length).fill('auto'),
            body: [headerRow, ...dataRows]
          }
        }
      ],
      pageSize: { width: 1214, height: 595 }
    };

    pdfMake.createPdf(documentDefinition).open();
  }



  applyFilter(dataSource: MatTableDataSource<any>, event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    dataSource.filter = filterValue.trim().toLowerCase();

    if (dataSource.paginator) {
      dataSource.paginator.firstPage();
    }
  }


  generatePDFReport() {
    const documentDefinition = this.getDocumentDefinition();

    // Genera el documento PDF
    pdfMake.createPdf(documentDefinition).open();
  }


  getDocumentDefinition() {
    // Define the content of the PDF document
    const content = [];

    // Title of the report
    content.push({
      text: 'Informe de Comunicaciones',
      style: 'header',
      alignment: 'center',
      margin: [0, 0, 0, 20] // Bottom margin of 20 units
    });

    // Table of communications
    const tableRows = [];

    // Table headers
    tableRows.push([

      { text: 'Proceso', style: 'tableHeader', rotation: 90 },
      { text: 'Información', style: 'tableHeader' },
      { text: 'Formato', style: 'tableHeader' },
      { text: 'Área', style: 'tableHeader' },
      { text: 'Propietario', style: 'tableHeader' },
      { text: 'Referencia', style: 'tableHeader' },
      { text: 'Frecuencia', style: 'tableHeader' },
      { text: 'Grupo', style: 'tableHeader' }
    ]);


    // Table rows
    Object.values(this.comunications).forEach((communication) => {
      tableRows.push([
        communication.procces,
        communication.information,
        communication.format,
        communication.area,
        communication.owner,
        communication.reference,
        communication.frequence,
        communication.group
      ]);
    });

   content.push({
      table: {
        headerRows: 1,
        widths: [ 'auto', 'auto', 'auto', 100, 'auto', 'auto', 'auto', 'auto'],
        body: tableRows
      }
    });

    // Define the styles for the document
    const styles = {
      header: {
        fontSize: 8,
        bold: false
      },
      tableHeader: {
        bold: false,
        fontSize: 8,
        fillColor: '#F2F2F2'
      }
    };

    // Define las opciones de configuración del documento
    const options = {
      pageSize: { width: 869, height: 595
      }  // Establece el tamaño del documento en formato horizontal
    };

    // Return the definition of the PDF document
    return {
      content: content,
      styles: styles,
      pageSize: options.pageSize
    };
  }


  /// que salgas de los reportes los borras
  CreatePDF() {
    const pdfDefinition: any = {
      content: [
        {
          table: {
            body: [
              ['col 1', 'col 2', 'col 3'],
              ['campo 1', 'campo 2', 'campo 3'],
              ['campo 4', 'campo 5', 'campo 6'],
              ['campo 7', 'campo 8', 'campo 9'],
            ],
          },
        },
      ],
    };

    const pdf = pdfMake.createPdf(pdfDefinition);
    pdf.open();
  }

  generatePdfold() {
    // Crear la fila de encabezados
    const headerRow = [
      'procces77',
      'information',
      'format',
      'Responsible',
      'owner',
      'Reference',
      'frequence',
      'Group',
      ...this.detailscom.map(detail => detail.name)
    ].map(header => ({ text: header, rotation: 90 }));

    // Crear las filas de datos
    const dataRows = this.comunications.map(com => [

      com.procces,
      com.information,
      com.format,
      com.area,
      com.owner,
      com.reference,
      com.frequence,
      com.group,
      ...this.detailscom.map(detail => detail.id === com[0].key ? 'X' : '')
    ]);

    const documentDefinition = {
      content: [
        {
          table: {
            headerRows: 1,
            widths: new Array(headerRow.length).fill('*'),
            body: [headerRow, ...dataRows]
          }
        }
      ],
      pageSize: { width: 969, height: 595 }
    };

    pdfMake.createPdf(documentDefinition).open();
  }


  getCommunicint() {
    //aqui qe pasar el id project que tengo los combo box
    this.communicationsService.getCommunications(this.trackingService.getProject())
      .then(dataInteres => {
        
        this.interestedList = dataInteres;
      })
      .catch(error => {
        console.log('Error:', error);
      });
  }



  enviarFormulario() {
    // Lógica para enviar el formulario y subir los archivos al almacenamiento
    // Puedes implementar la funcionalidad correspondiente aquí
    console.log('Formulario enviado');
  }

  adjuntarArchivos(event: any) {
    this.archivos = event.target.files;
  }

  cancelar() {
    // Lógica para cancelar la ventana
    // Puedes implementar la funcionalidad correspondiente aquí
    console.log('Ventana cancelada');
  }


}

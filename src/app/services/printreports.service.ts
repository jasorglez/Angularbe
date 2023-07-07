import { Injectable, Inject } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

import { TrackingService } from 'src/app/services/tracking.service';

import { InteresService } from './interes.service';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

import * as ExcelJS from 'exceljs';
import * as XLSX from 'xlsx';




@Injectable({
  providedIn: 'root'
})
export class PrintreportsService {

constructor(public  trackingService : TrackingService,
            private interesService : InteresService,
            private http: HttpClient) { }


//Aqui empezamos el Excel

 writeDataToExcelFile(filePath: string) {
  this.http.get(filePath, { responseType: 'blob' }).subscribe(data => {

    const workbook = XLSX.read(data, {type: 'array'});
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    worksheet['D16'].v = 'Aqui va el contrato C8';
    worksheet['F14'].v = 'aQUIVA EL PROYECTO C10';

    const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'archivo.xlsx';
    link.click();
    window.URL.revokeObjectURL(url);
  });
 }



 writeDataToExcelFile2(filePath: string) {
  let workbook = XLSX.readFile(filePath);
  let worksheet = workbook.Sheets[workbook.SheetNames[0]];

  // Escribir en la celda F10 (columna 6, fila 10)
  let cellF10 = {c: 5, r: 9};  // Las columnas y filas en xlsx empiezan desde 0
  let cellRefF10 = XLSX.utils.encode_cell(cellF10);
  worksheet[cellRefF10] = {t: 's', v: 'Estoy en la columna 6 y fila 10'};

  // Escribir en la celda F11 (columna 6, fila 11)
    let cellF11 = {c: 5, r: 10};
    let cellRefF11 = XLSX.utils.encode_cell(cellF11);
  worksheet[cellRefF11] = {t: 's', v: 'Estoy en la columna 6 y fila 11'};

  XLSX.writeFile(workbook, filePath);
 }



 writeDataToExcelFile3(filePath: string) {
  this.http.get(filePath, {responseType: 'arraybuffer'}).subscribe(data => {
    const workbook = XLSX.read(data, {type: 'array'});
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    worksheet['D16'].v = 'Aqui va el contrato C8';
    worksheet['F14'].v = 'aQUIVA EL PROYECTO C10';

    const cellF10 = {c: 5, r: 9}; // Corregido el valor de la fila
    const cellRefF10 = XLSX.utils.encode_cell(cellF10);
    worksheet[cellRefF10] = {t: 's', v: 'Estoy en la columna 6 y fila 10'};

    const cellF11 = {c: 6, r: 9}; // Corregido el valor de la fila
    const cellRefF11 = XLSX.utils.encode_cell(cellF11)
       worksheet[cellRefF11] = {t: 's', v: 'Estoy en la columna 7 y fila 10'};

    const cellF12 = {c: 2, r: 11}; // Corregido el valor de la fila
    const cellRefF12 = XLSX.utils.encode_cell(cellF12)
    worksheet[cellRefF12] = {t: 's', v: 'Estoy en la columna 3 y fila 12'};

    XLSX.writeFile(workbook, 'output.xlsx');
  });
 }



  enviarMensajesAExcel() {
    // Crea un nuevo libro de Excel
    const workbook = new ExcelJS.Workbook();

    // Agrega una nueva hoja de trabajo
    const worksheet = workbook.addWorksheet('Sheet 1xxx');

    // Define el mensaje y la ubicación
    const mensaje1 = 'Valor en la columna J y Renglon 5';
    const columna1 = 'J';
    const renglon1 = 5;

    // Escribe el mensaje en la columna y renglón especificados
    worksheet.getCell(`${columna1}${renglon1}`).value = mensaje1;

    // Define los otros dos mensajes y ubicaciones
    const mensaje2 = 'Mensaje columna A renglon 10';
    const columna2 = 'A';
    const renglon2 = 10;

    const mensaje3 = 'Renglon 15 y columna D';
    const columna3 = 'D';
    const renglon3 = 15;

    // Escribe los otros dos mensajes en las ubicaciones especificadas
    worksheet.getCell(`${columna2}${renglon2}`).value = mensaje2;
    worksheet.getCell(`${columna3}${renglon3}`).value = mensaje3;

    // Guardar el libro de Excel como un archivo temporal
    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const excelUrl = URL.createObjectURL(blob);

      // Abrir el archivo de Excel en una nueva ventana o con la aplicación predeterminada
      window.open(excelUrl, '_blank');
    });

  }


  listInterested() {

    let dataRows : any

    const headerRow = [
      { text: 'ID', style: 'headerCellBlue' },
      {text: 'Nombre', style: 'headerCellBlue' },
      {text: 'Organizacion', style: 'headerCellBlue' },
      {text: 'Puesto',  style: 'headerCellBlue' },
      {text: 'Telefono', style: 'headerCellBlue' },
      {text: 'Correo', style: 'headerCellBlue' },
      {text: 'Interes', style: 'headerCellBlue' },
      {text: 'Influencia', style: 'headerCellBlue' },
      {text: 'Poder', style: 'headerCellBlue' }, 
      {text: 'Ponderacion', style: 'headerCellBlue' }, 
      {text: 'Seguimiento', style: 'headerCellBlue' }];

      
      this.interesService
      .getDatacompInteres(this.trackingService.getProject(), this.trackingService.getformrepint())
      .subscribe(
        (data) => {
          const dataRows = data;
          console.log("DataRows", dataRows);
          const imagePath = this.trackingService.getpictureComp();
          this.downloadAndProcessImage(imagePath, headerRow, dataRows, 2);
        },
        (error) => {
          console.error(error);
        }
      );
            
  }


//Aqui empieza el reporte
   generarReporte(detailscom2: any[], comunications: any[]) {

    // estee es para el
        comunications.sort((a, b) => {
          if (a.procces < b.procces) {
            return -1;
          } else if (a.procces > b.procces) {
            return 1;
          } else {
            return 0;
          }
        })


        // Obtener los detalles de comunicaciones únicos
        const uniqueDetails = detailscom2;
        const uniqueDetailNames = [...new Set(uniqueDetails.map(detail => detail.name))].sort();

        // Crear o armar la cabecera la fila de encabezados
        const headerRow = [
          { text: 'Proceso', style: 'headerCellBlue' },
          { text: 'Informacion', style: 'headerCellBlue' },
          { text: 'Formato', style: 'headerCellBlue' },
          { text: 'Responsable', style: 'headerCellBlue' },
          { text: 'Referencia', style: 'headerCellBlue' },
          { text: 'Frecuencia', style: 'headerCellBlue' },
          { text: 'Grupo', style: 'headerCellBlue' },
          ...uniqueDetailNames.map((name, index) => ({
            text: name,
            style: index % 2 === 0 ? 'headerCellYellow' : 'headerCellBlue',
            rotation: 90
          }))
        ];

        // Crear las filas de datos
        const dataRows = comunications.map(com => {
          const details = detailscom2.filter(detail => detail.id === com.id);

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

         const imagePath = this.trackingService.getpictureComp();
         this.downloadAndProcessImage(imagePath, headerRow, dataRows,1)
   }



// Method to download and process the image

private downloadAndProcessImage(imagePath: string, headerRow: any[], dataRows: any[], report: number) {
  this.http.get(imagePath, { responseType: 'blob' }).subscribe((imageBlob: Blob) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const imageDataUrl = reader.result as string;
      const documentDefinition = this.generateDocumentDefinition(headerRow, dataRows, imageDataUrl, report);
      pdfMake.createPdf(documentDefinition).open();
    };
    reader.readAsDataURL(imageBlob);
  });
}


// Method to generate documentDefinition
  generateDocumentDefinition(headerRow : any[], dataRows: any[], imageDataUrl, report: number) {
    let tableBody: any[] = [];
  
    if (report===1) {
    tableBody= [
      headerRow.map((text, index) => ({
        text,
        style: index < 7 ? 'headerCellBlue' : ('headerCellYellow' )
      })),
      ...dataRows
    ];
  }

  if (report===2) {
    tableBody= [headerRow, ...dataRows]
  }


  return {
    content: [
      {
        width: 50,
        image: imageDataUrl,
        fit: [90, 90] // Ajusta el tamaño
      },
      {
        text: `Compañía: ${this.trackingService.getnameComp()}`,
        style: 'header',
        fontSize: 8,
        bold: false
      },
      {
        alignment: 'right',
        text    : 'HCO-PMO-FOR-002',
        style: 'header',
        fontSize: 9,
        bold: false
     },
     {
       alignment: 'right',
       text    : 'Rev.-. 00',
       style: 'header',
       fontSize: 9,
       bold: false
    },
    
      {
        alignment: 'center',
        text: report === 1 ? 'PLAN DE GESTION DE COMUNICACIONES' : 'PLAN DE GESTION DE INTERESADOS',
        style: 'header',
        
      },

      {
        alignment: 'center',
        text: `SISTEMAS DE GESTION DE CALIDAD`,
        style: 'header'
      },
      {
        alignment: 'left',
        text: `Ref.: HCO-CAL-SGC-01`,
        style: 'header',
        fontSize: 9,
        bold: false

      },
      {
        alignment: 'left',
        table: {
          widths: ['50%'],
          body: [
            [{ text: `Contrato: ${this.trackingService.getContract()}`, style: 'headerText', }]
          ]
        },
        layout: 'Borders'
      },

      {
        alignment: 'left',
        table: {
          widths: ['50%'],
          body: [
            [{ text: `Proyecto: ${this.trackingService.getnameProject()}`, style: 'headerText' }]
          ]
        },
        layout: 'Borders'
      },


      {
        alignment: 'left',
        table: {
          widths: ['50%'],
          body: [
            [{ text: `Orden de Trabajo: ${this.trackingService.getnameProject()}`, style: 'headerText' }]
          ]
        },
        layout: 'Borders'
      },

      {
        alignment: 'left',
        table: {
          widths: ['50%'],
          body: [
            [{ text: `Instalacion: ${this.trackingService.getubicationProject()}`, style: 'headerText' }]
          ]
        },
        layout: 'Borders'
      },
         
     

      {
        columns: [
          {
            width: '75%',
            alignment: 'right',
            text: 'Inicio',
            style: 'headerText'
          },
          {
            width: '15%',
            alignment: 'center',
            text: 'Termino',
            style: 'headerText'
          },
          {
            width: '10%',
            alignment: 'center',
            text: 'Duracion',
            style: 'headerText'
          }
        ]
      },

      {
        columns: [
          {
            width: '75%',
            alignment: 'right',
            text: this.trackingService.getStart(),
            style: 'headerText'
          },
          {
            width: '15%',
            alignment: 'center',
            text: this.trackingService.getEnd(),
            style: 'headerText'
          },
          {
            width: '10%',
            alignment: 'center',
            text: '30',
            style: 'headerText'
          }
        ]
      },
      

      {
        table: {
          headerRows: 1,
          widths: new Array(headerRow.length).fill('auto'),
          body: tableBody
        }
      }

    ],



    footer: {
      columns: [
        {
          alignment: 'left',
          stack: [
            { text: 'ELABORO', style: 'footerText' },
            { text: 'Ing. de Proyecto HCO', style: 'footerText' }
          ]
        },
        {
          alignment: 'center',
          stack: [
            { text: 'ELABORO', style: 'footerText' },
            { text: 'Supervision de Contrato', style: 'footerText' }
          ]
        },
        {
          alignment: 'right',
          stack: [
            { text: 'ELABORO', style: 'footerText' },
            { text: 'Ingeniero Empresa Construccion', style: 'footerText' }
          ]
        }
      ]
    },
    pageSize: { 
      width: report === 1 ? 1414 : (report === 2 ? 1254 : 595),
      height: 596
    },
     
    styles: {
      header: {
        fontSize: 15,
        bold: true,
        margin: [0, 0, 0, 10], // Margen inferior de 10 puntos
       },
       headerCell: {
        fillColor: '#007bff',
        color: '#fff',
        bold: true
       },
       headerText: {
        fontSize: 10,
        bold: true,
        margin: [0, 0, 0, 10], // Margen inferior de 10 puntos
        border: [true, true, true, true], // Agrega el borde alrededor del texto
        padding: [5, 5, 5, 5] // Añade un espacio de relleno dentro del borde
      },
      footerText: {
        fontSize: 10,
        bold: true,
        margin: [0, 5, 0, 0]
      },
      headerCellBlue: {
        fillColor: '#80bfff',
        color: '#000',
        bold: true
      },
      headerCellYellow: {
        fillColor: '#ffc107',
        color: '#000',
        bold: true
      }
    }

    }
  }




getDocumentDefinition(comunications: any[])
{
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
  Object.values(comunications).forEach((communication) => {
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




generatePdfold(detailscom: any[], comunications: any[])
 {
  // Crear la fila de encabezados
  const headerRow = [
    'procces',
    'information',
    'format',
    'Responsible',
    'owner',
    'Reference',
    'frequence',
    'Group',
    ...detailscom.map(detail => detail.name)
  ].map(header => ({ text: header, rotation: 90 }));

  // Crear las filas de datos
  const dataRows = comunications.map(com => [

    com.procces,
    com.information,
    com.format,
    com.area,
    com.owner,
    com.reference,
    com.frequence,
    com.group,
    ...detailscom.map(detail => detail.id === com[0].key ? 'X' : '')
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






}




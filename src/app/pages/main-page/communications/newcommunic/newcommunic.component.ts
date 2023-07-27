import { Component, Inject,  OnInit } from '@angular/core';

import { CommunicationsService } from 'src/app/services/communications.service';
import { TrackingService } from 'src/app/services/tracking.service';

import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { alerts } from 'src/app/helpers/alerts';

import { Icommunications } from 'src/app/interface/icommunication';

import { AngularFireStorage } from '@angular/fire/compat/storage';

@Component({
  selector: 'app-newcommunic',
  templateUrl: './newcommunic.component.html',
  styleUrls: ['./newcommunic.component.css']
})
export class NewcommunicComponent implements OnInit {

  detailscomp     : any[] = [] ;

  recibirDatos(detailscomp: any[] = [] ):void {
    this.detailscomp = detailscomp ;
   // console.log('recibido');
  }

  interestedList  : any[] = [];
  selectedInteres : any[] = [];


  availableUsers  : any[];

  selectedInterested: { name: string; email: string; }[] = [];

  selectedValue: string;

  formSubmitted = false;
  loadData = false;

 public fcommunications = this.formBuilder.group({
      active        :  1,
      process       : '',
      information   :  '',
      format        :  [, [Validators.required]],
      area          :  ['', [Validators.required]],
      owner         :  '',
      reference     :  ['',[Validators.required]],
      frequence     :  '',
      group         :  ['', [Validators.required]],

   } )


   public fdocuments = this.formBuilder.group({

    fecha       : '',
    descripcion :  '',
    owner        :  '',
   } )


   archivosSeleccionados: Archivo[] = [];

  constructor( private communicationservice : CommunicationsService,
               private trackingService: TrackingService,
               private formBuilder: FormBuilder,
               private storage: AngularFireStorage,
               public dialogRef: MatDialogRef<NewcommunicComponent >,
               @Inject(MAT_DIALOG_DATA) public data: any) { }

    ngOnInit() {

      if (this.data.formType === 'fcommunications')  {
        this.getCommunicint();
      }

      if (this.data.formType === 'fdocuments')  {

      }

    }

    buscarSubdetalle(id: string) {
      this.communicationservice.buscarSubdetalle(id).subscribe(
        subdetalles => {
          if (subdetalles.length > 0) {
            console.log('Subdetalles:', subdetalles);
            // Realiza acciones con los subdetalles obtenidos
          } else {
            console.log('No se encontraron subdetalles');
          }
        },
        error => {
          console.error('Error al buscar los subdetalles:', error);
        }
      );
    }


    getCommunicint() {
      //aqui qe pasar el id project que tengo los combo box
      this.communicationservice.getCommunications(this.trackingService.getProject())
        .then(dataInteres => {
          this.interestedList = dataInteres;

        })
        .catch(error => {
          console.log('Error:', error);
        });
    }



    onInteresSelect() {

       const selectedOwner = this.fcommunications.get('owner').value;

       this.availableUsers = this.interestedList.filter(interes => interes.name !== selectedOwner);

    }


  saveCommunications(){
    this.loadData = true;

    this.formSubmitted = true;

        /*=============================================
    Validamos y capturamos la informacion del formulario en la interfaz
    =============================================*/
       const dataCommunications: Icommunications = {
              active        : 1,
              id            : '',
              name          : 'name',
              procces       : this.fcommunications.controls.process.value,
              id_project    : this.trackingService.getProject(),
              information   : this.fcommunications.controls.information.value ?? '',
              format        : this.fcommunications.controls.format.value ?? '',
              area          : this.fcommunications.controls.area.value ?? '',
              owner         : this.fcommunications.controls.owner.value ?? '',
              reference     : this.fcommunications.controls.reference.value ?? '',
              frequence     : this.fcommunications.controls.frequence.value ?? '',
              group         : this.fcommunications.controls.group.value ?? ''
         }


         this.communicationservice.postCommunic(dataCommunications, localStorage.getItem('token')).subscribe(
          (resp: any) => { // Indicar que la respuesta es de tipo 'any'
            const savedKey = resp.key; // Obtener la clave asignada al guardar el registro

            // Guardar el detalle utilizando la clave
            this.saveToDetailInterested(savedKey);

              alerts.basicAlert('Ok', 'The communication has been saved', 'success');

              this.dialogRef.close('save');
            },
                err=>{
                       alerts.basicAlert("Error", 'User saving error', "error")
                }
         );
  }


  saveToDetailInterested(key: string) {
    // Recorrer el arreglo selectedInterested y agregar la clave correspondiente a cada nombre
     const details: any[] = this.selectedInterested.map(interest => {
       return {
         id: key,
         name     : interest.name,
         email    : interest.email,
         position : '' ,
         active : 1
       };
     });

     this.communicationservice.postCommunicDetail(details, localStorage.getItem('token')).subscribe(
       (resp: any) => {

        // console.log('Details:', details);
         // Resto del código para guardar los detalles del interesado
       }
     )
}



addSelectedInterested() {
  const selectedInterElement = document.getElementById('selectedUsers') as HTMLSelectElement;

  const selectedValue = selectedInterElement.value;
  const selectedOption = selectedInterElement.options[selectedInterElement.selectedIndex];

  const selectedName = selectedOption.text;
  const selectedEmail = selectedValue;

  const selectedInterest = {
    name: selectedName,
    email: selectedEmail
  };
  this.selectedInterested.push(selectedInterest);

}


  removeSelectedInterested(index: number) {
    this.selectedInterested.splice(index, 1);
  }


  adjuntarArchivos(event: any): void {

    const archivos: FileList = event.target.files;
    for (let i = 0; i < archivos.length; i++) {
      const archivo = archivos[i];
      // Generar miniatura y obtener su URL
      const miniaturaUrl = URL.createObjectURL(archivo);

      // Guardar archivo en el almacenamiento (storage) y enviar por correo
      const filePath = `pdf/${archivo.name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, archivo);

      task.snapshotChanges().subscribe(() => {
        // Archivo subido correctamente, aquí puedes realizar acciones adicionales si es necesario
        // Por ejemplo, enviar el correo con el archivo adjunto utilizando el Trigger Email desde Firestore

        // Agregar archivo a la lista de archivos seleccionados para mostrar miniaturas
        this.archivosSeleccionados.push({
          nombre: archivo.name,
          thumbnailUrl: miniaturaUrl
        });
      });
    }
  }


  enviarFormulario() {
    // Lógica para enviar el formulario y subir los archivos al almacenamiento
    // Puedes implementar la funcionalidad correspondiente aquí
    console.log('Formulario enviado');
  }


  cancelar() {
    // Lógica para cancelar la ventana
    // Puedes implementar la funcionalidad correspondiente aquí
    console.log('Ventana cancelada');
  }

}


interface Archivo {
  nombre: string;
  thumbnailUrl: string;
}

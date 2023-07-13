import { Component, Inject, OnInit } from '@angular/core';

import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { alerts } from 'src/app/helpers/alerts';

import { Ilessons } from 'src/app/interface/ilessons';

import { CommunicationsService } from 'src/app/services/communications.service';

import { TraductorService } from 'src/app/services/traductor.service';
import { TrackingService } from 'src/app/services/tracking.service';
import { LessonsService } from 'src/app/services/lessons.service';
import { FirebaseService } from 'src/app/services/firebase.service';

import { StoragesService } from 'src/app/services/storages.service';

@Component({
  selector: 'app-newless',
  templateUrl: './newless.component.html',
  styleUrls: ['./newless.component.css']
})
export class NewlessComponent implements OnInit {


  interestedList  : any[] = [];
  selectedInteres : any[] = [];

  selectedFile: File | null = null;

  availableUsers  : any[];

  selectedInterested: { name: string; email: string; }[] = [];

  selectedValue: string;

  formSubmitted = false;

  loadData = false;

  url : string = '' ;


  public flessons = this.formBuilder.group({
    active     :  1,
    details    : [, [Validators.required]],
    meeting    :  '',
    place      :  [, [Validators.required]],
    datep      :  '',
    timep      :  ['',[Validators.required]],
    typemeeting  : '',
    file       :  ''

 } )


  constructor(private trackingService: TrackingService,
      private translateService     : TraductorService,
      private communicationservice : CommunicationsService,
      private lessonsService       : LessonsService,
      private firebaseService      : FirebaseService,
      private formBuilder: FormBuilder,
      private storage: StoragesService,
      public dialogRef: MatDialogRef<NewlessComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    if (this.data.formType === 'flessons')  {
      this.getInterest();
    }


  }

    getInterest() {
      //aqui qe pasar el id project que tengo los combo box
      this.communicationservice.getCommunications(this.trackingService.getProject())
        .then(dataInteres => {
          this.interestedList = dataInteres;

        })
        .catch(error => {
          console.log('Error:', error);
        });
    }


 saveLessons() {

    this.loadData = true;

    this.uploadFile();

    this.formSubmitted = true;
      /*=============================================
      Validamos y capturamos la informacion del formulario en la interfaz
      =============================================*/
         const dataLessons  : Ilessons = {
                active      :  1,
                datep       :  new Date(this.flessons.get('datep').value),
                details     :  this.flessons.get('details').value,
                id_project  :  this.trackingService.getProject() ,
                file        :  this.url ,
                place       :  this.flessons.get('place')?.value,
                typemeeting :  this.flessons.get('typemeeting')?.value,
                timep       :  this.flessons.get('timep')?.value
         }

         console.log('la segunda vez', this.url) ;

            this.loadData = false;



            this.lessonsService.postData(dataLessons, localStorage.getItem('token')).subscribe(
              (resp: any) => {

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
    const fieldName = key; // Nombre del campo con nombre dinámico

    console.log('Registro automatico', key);

     const details: any[] = this.selectedInterested.map(interest => {
       return {
         name     : interest.name,
         email    : 'correo',
         position : '' ,
         active : 1
       };
     });

     this.firebaseService.createDetailLessons(details, key)
         .then(()  => {

        // console.log('Details:', details);
         // Resto del código para guardar los detalles del interesado
       }
     )
  }


 onCheckboxChange(event: any) {
  const checked = event.target.checked;
  const tipoReunionControl = this.flessons.get('typemeeting');

  if (checked) {
    tipoReunionControl.setValue(event.target.id);
  } else {
    tipoReunionControl.setValue('');
  }
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

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadFile() {
    if (this.selectedFile) {
      this.storage.uploadPdf(this.selectedFile)
        .then(downloadUrl => {
          this.url = downloadUrl ;
          // Aquí puedes guardar el enlace de descarga (downloadUrl) en tu registro o realizar cualquier otra acción necesaria
          console.log('Download this.url:', this.url);
        })
        .catch(error => {
          console.error('Upload error:', error);
        });
    }
  }


}

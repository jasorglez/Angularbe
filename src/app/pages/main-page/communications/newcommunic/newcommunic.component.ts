import { Component, OnInit } from '@angular/core';

import { CommunicationsService } from 'src/app/services/communications.service';
import { TrackingService } from 'src/app/services/tracking.service';

import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { alerts } from 'src/app/helpers/alerts';

import { Icommunications } from 'src/app/interface/icommunication';

@Component({
  selector: 'app-newcommunic',
  templateUrl: './newcommunic.component.html',
  styleUrls: ['./newcommunic.component.css']
})
export class NewcommunicComponent implements OnInit {

  interestedList  : any[] = [];
  selectedInteres : any[] = [];
  availableUsers  : any[];
  selectedInterested: string[]=[];

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
      id_interested :  '',
   } )

  constructor( private communicationservice : CommunicationsService,
               private trackingService: TrackingService,
               private formBuilder: FormBuilder,
               public dialogRef: MatDialogRef<NewcommunicComponent >) { }

    ngOnInit() {

      this.getCommunicint();

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
          console.log("Los datos", dataInteres);
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
     const details: any[] = this.selectedInterested.map(name => {
       return {
         id: key,
         name: name,
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



  addSelectedInterested()
  {
        const selectedInter = (document.getElementById('selectedUsers') as HTMLSelectElement).value;

        this.selectedInterested.push(selectedInter);
         console.log('Selected Interes:', this.selectedInterested);
         //     console.log('Available Users:', this.availableUsers);
  }

  removeSelectedInterested(index: number) {
    this.selectedInterested.splice(index, 1);
  }


}

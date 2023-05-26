import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { functions } from 'src/app/helpers/functions';
import { MatDialogRef } from '@angular/material/dialog';

import { Iinteres } from 'src/app/interface/interested';

import { StoragesService } from 'src/app/services/storages.service';
import { InteresService } from 'src/app/services/interes.service';
import { CatalogService } from 'src/app/services/catalog.service';
import { TrackingService } from 'src/app/services/tracking.service';

import { environment } from 'src/environments/environment';

import { alerts } from 'src/app/helpers/alerts';


@Component({
  selector: 'app-newInterested',
  templateUrl: './newInterested.component.html',
  styleUrls: ['./newInterested.component.css']
})
export class NewInterestedComponent implements OnInit {


   numbers: number[] = [1, 2, 3, 4, 5];
   selectedNumber: number;
   interes   : 1 ;
   influence : 2 ;
   power     : 3 ;
   selectedorganization: string = 'Organizations';
   organizationData     : any[]  = [] ;

	/*=============================================
	Creamos grupo de controles
	=============================================*/

	public fis = this.formBuilder.group({

      active       : 1,
      avg          : [0, [Validators.required, Validators.pattern('^(1[8-9]|[2-5][0-9]|6[0-9])$')]],
      email        : ['', [Validators.required, Validators.email]],
      follow       : 'Reporte Diario',
      iduser       : 0,
      interes      : 0,
      influence    : 0,
      name         : ['', [Validators.required]],
      phone        : '',
      picture      : environment.urlProfile,
      position     : ['', Validators.required],
      power        : 0,
      organization : '',
      role         : ''
   } )

    get name() { return this.fis.controls['name'] }

      /*=============================================
	  Variable que valida el envío del formulario
	=============================================*/

	formSubmitted = false;

  /*----------------------------
    Variable para preCarga
   ----------------------------*/

  loadData = false;
  url : string = '' ;

  constructor(private storageService: StoragesService, private interesService : InteresService, private catalogServices: CatalogService, private trackingService: TrackingService, private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<NewInterestedComponent> ) {
        this.selectedNumber = this.numbers[0]}

  ngOnInit(): void {

    /*puedo ver o escuchar un evento del form
    this.name.valueChanges
    .subscribe(value => {
       console.log(value)
    })  */

    this.getOrganizations();


  }


  onSelectOrganization(): void {
    console.log('Id Company ->', this.selectedorganization);
    this.getOrganizations();
  }


  getOrganizations(){
    this.catalogServices.getdataOrganization().subscribe(( orga) => {
      this.organizationData = Object.values(orga)
     })

   }

  /*=========================
    Para las fotos
  ========================== */
  uploadImage($event: any) {
    const file = $event.target.files[0];
    const path = `images/${file.name}` ;

    this.storageService.uploadFile(file, path)
    .then(url => {
       console.log("URL", url);
       this.url = url;
       this.fis.patchValue({ picture: url}) ;

    })
    .then(url => {
      console.log("Download URL", url);

    })
    .catch(error => console.log("Error uploading file", error));

  }


  saveInteres() {
    if (this.fis.valid) {
      console.log(this.fis.value)
    }else{
      this.fis.markAllAsTouched();
    }

    this.loadData = true;

    this.formSubmitted = true;

    /*------------------------------
     Validamos que el formulario este correcto
    -----------------------*/

    /*=============================================
    Validamos y capturamos la informacion del formulario en la interfaz
    =============================================*/
       const dataInteres: Iinteres = {
              active      : 1,
              avg          : this.fis.controls.avg.value ?? 0,
              email        : this.fis.controls.email.value ?? '',
              follow       : this.fis.controls.follow.value ?? '',
              idinter      : 1 ,
              interes      : this.interes,
              influence    : this.influence,
              name         : this.fis.controls.name.value ?? '',
              phone        : this.fis.controls.phone.value ?? '',
              picture      : this.fis.controls.picture.value ?? '',
              position     : this.fis.controls.position.value ?? '',
              project      : this.trackingService.getProject(),
              power        : this.power,
              organization : this.fis.controls.organization.value ?? '',
              role         : this.fis.controls.role.value ?? ''
         }

          const email = this.fis.controls.email.value ?? '';

          this.loadData = false;

            this.interesService.checkIfDataExists(email).subscribe(dataExists => {
              if (dataExists) {
                alerts.basicAlert("Error", 'The User exist', "error")
              } else {
                      this.interesService.postData(dataInteres, localStorage.getItem('token')).subscribe(
                        resp=>{
                               this.dialogRef.close('save')
                                alerts.basicAlert("Ok", 'The User has been saved', "success")
                        },
                             err=>{
                               alerts.basicAlert("Error", 'User saving error', "error")
                             })
              }
            });

  }

  invalidField(field:string){
    return functions.invalidField(field, this.fis, this.formSubmitted);

}

}

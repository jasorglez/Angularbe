import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { functions } from 'src/app/helpers/functions';
import { MatDialogRef } from '@angular/material/dialog';

import { Iusers } from 'src/app/interface/iusers';

import { UsersService } from '../../../../services/users.service';
import { StoragesService } from 'src/app/services/storages.service';
import { CatalogService } from 'src/app/services/catalog.service';
import { AuthService } from 'src/app/services/auth.service';

import { alerts } from 'src/app/helpers/alerts';
import { finalize } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { TrackingService } from '../../../../services/tracking.service';
import { getDownloadURL } from '@angular/fire/storage';


@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.css']
})
export class NewComponent implements OnInit {

   selectedorganization: string = 'Organizations';

   organizationData     : any[]  = [] ;

   emailExists: boolean = false;

	/*=============================================
	Creamos grupo de controles
	=============================================*/

	public fus = this.formBuilder.group({

    active       :  1,
    iduser       :  0,
    age          :  [, [Validators.required, Validators.pattern('^(1[8-9]|[2-5][0-9]|6[0-9])$')]],
    country      :  ['', [Validators.required]],
    displayName  :  ['', [Validators.required]],
    emailu       :  ['email', [Validators.required, Validators.email]],
    method       :  '',
    passnew      :  ['', [Validators.required]],
    phone        :  ['',  [Validators.required, Validators.pattern(/^\d{10}$/)]],
    picture      :  environment.urlProfile,
    position     :  ['', Validators.required],
    organization :  '',

   } )

   get agef() { return this.fus.get('age') }
 
   get namef() { return this.fus.get('displayName') }

   get positionf() { return this.fus.get('position') }




  /*=============================================
	  Variable que valida el envío del formulario
	=============================================*/

	formSubmitted = false;

  /*----------------------------
    Variable para preCarga
   ----------------------------*/

  loadData = false;
  url : string = '' ;

  constructor(private storageService: StoragesService, private usersService :UsersService, private catalogsService: CatalogService, private authService: AuthService,
              private formBuilder: FormBuilder,  public dialogRef: MatDialogRef<NewComponent>, ) { }

  ngOnInit( ): void {
    this.getOrganizations();
  }

  onSelectOrganization(): void {
    console.log('Id Company ->', this.selectedorganization);
    this.getOrganizations();
  }


  getOrganizations(){
    this.catalogsService.getdataOrganization().subscribe(( orga) => {
      this.organizationData = Object.values(orga)
     })
    }

  /*=========================
    Para las fotos
  ========================== */


  selectedImage: File;
  imageUrl: string = environment.urlProfile

uploadImage($event: any) {
  const file = $event.target.files[0];
  this.selectedImage = file;
  const path = `images/${file.name}`;

  if (!file) {
    this.imageUrl = ''; // No hay imagen seleccionada, establecemos la URL vacía
    return;
  }

  this.storageService.uploadFile(file, path)
    .then(url => {
        this.url = url;
        this.imageUrl = this.storageService.getObjectURL(this.selectedImage); // Almacenar la URL de la imagen seleccionada
        this.fus.patchValue({ picture: url }); // Actualizar el valor del control 'picture' con la URL de la imagen
    })
    .catch(error => console.log("Error uploading file", error));
}


  saveUsers(){
        if (this.fus.valid) {
          console.log(this.fus.value)
        }else{
          this.fus.markAllAsTouched();
        }

        this.loadData = true;

        this.formSubmitted = true;

              /*------------------------------
               Validamos que el formulario este correcto
              -----------------------*/

              /*=============================================
              Validamos y capturamos la informacion del formulario en la interfaz
              =============================================*/
                 const dataUser: Iusers = {
                        active         : 1,
                        iduser         : 0,
                        method         : '',
                        age            : this.fus.controls.age.value ?? 0,
                        country        : this.fus.get('country').value,
                        displayName    : this.fus.controls.displayName.value ?? '',
                        emailu          : this.fus.controls.emailu.value ?? '',
                        password       : this.fus.controls.passnew.value ?? '',
                        phone          : this.fus.controls.phone.value ?? '',
                        picture        : this.fus.controls.picture.value ?? '',
                        position       : this.fus.controls.position.value ?? '',
                        organization   : this.fus.controls.organization.value ?? ''
                    }

                    const email = this.fus.controls.emailu.value ?? '';

                    this.loadData = false;

                      this.usersService.checkIfDataExists(email).subscribe(dataExists => {
                        if (dataExists) {
                          alerts.basicAlert("Error", 'The User exist', "error")
                        } else {
                                this.usersService.postData(dataUser, localStorage.getItem('token')).subscribe(
                                  resp=>{
                                         this.dialogRef.close('save')
                                          alerts.basicAlert("Ok", 'The User has been saved', "success")
                                          this.authService.register(this.fus.controls.emailu.value, this.fus.controls.passnew.value);

                                  },
                                       err=>{
                                         alerts.basicAlert("Error", 'User saving error', "error")
                                       })
                        }
                      });
    }


    invalidField(field:string){
        return functions.invalidField(field, this.fus, this.formSubmitted);

    }


    checkEmailExists() { 

      const emailread = this.fus.controls.emailu.value;
      
      if (emailread) { 

           this.usersService.checkIfDataExists(emailread).subscribe( dataExists => {

            if (dataExists) { 

                  this.emailExists = dataExists ;

                }else {

                    this.emailExists = false ;
               }

            });
          
          }

    }

      

}

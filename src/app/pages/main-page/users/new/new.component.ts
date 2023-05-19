import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { functions } from 'src/app/helpers/functions';
import { MatDialogRef } from '@angular/material/dialog';
import { Iusers } from 'src/app/interface/iusers';
import { UsersService } from '../../../../services/users.service';
import { alerts } from 'src/app/helpers/alerts';
import { Storage, ref, uploadBytes} from '@angular/fire/storage'
import { environment } from 'src/environments/environment';

import { finalize } from 'rxjs/operators';


@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.css']
})
export class NewComponent implements OnInit {




	/*=============================================
	Creamos grupo de controles
	=============================================*/

	public fus = this.form.group({

    active       : 1,
    iduser       : 0,
    age          : [30, [Validators.required, Validators.pattern('^(1[8-9]|[2-5][0-9]|6[0-9])$')]],
    country      : 'MEXICO',
    displayName  : ['', [Validators.required]],
    email        : ['', [Validators.required, Validators.email]],
    method       : '',
    phone        : '',
    picture      : 'S/P',
    position     : ['', Validators.required],
    organization : ['', Validators.required],

   } )

   get age() { return this.fus.controls['age'] }
   get displayname() { return this.fus.controls['displayName'] }


  /*=============================================
	  Variable que valida el envío del formulario
	=============================================*/

	formSubmitted = false;

  /*----------------------------
    Variable para preCarga
   ----------------------------*/

  loadData = false;


  constructor(private form: FormBuilder, private usersService :UsersService,
    public dialogRef: MatDialogRef<NewComponent>, ) { }

  ngOnInit( ): void {
  }


   uploadImage($event: any) {
     /* const storageUrl  = environment.urlFiles
      const file=$event.target.files[0];
      console.log(file);

      const imgRef = ref(this.storage, `storageUrl${file.name}`)

     //const storageRef = this.storage.ref(storageUrl);
    // const imgRef = storageRef.child(`img/$file.name`);    

       uploadBytes(imgRef, file)
      .then(response => console.log(response))
      .catch(error => console.log(error));*/
    }

  saveUsers(){

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
              country        : this.fus.controls.country.value ?? '',
              displayName    : this.fus.controls.displayName.value ?? '',
              email          : this.fus.controls.email.value ?? '',
              phone          : this.fus.controls.phone.value ?? '',
              picture        : this.fus.controls.picture.value ?? '',
              position       : this.fus.controls.position.value ?? '',
              organization   : this.fus.controls.organization.value ?? ''
          }

          const email = this.fus.controls.email.value ?? '';

          this.loadData = false;

          //const email = 'example@example.com';

            this.usersService.checkIfDataExists(email).subscribe(dataExists => {
              if (dataExists) {
                alerts.basicAlert("Error", 'The User exist', "error")
              } else {
                      this.usersService.postData(dataUser, localStorage.getItem('token')).subscribe(
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
        return functions.invalidField(field, this.fus, this.formSubmitted);

    }


}

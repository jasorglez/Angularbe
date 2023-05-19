import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { functions } from 'src/app/helpers/functions';
import { Iusers } from 'src/app/interface/iusers';
import { UsersService } from '../../../../services/users.service';
import { alerts } from 'src/app/helpers/alerts';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IDialogData } from '../../branchs/edit-branch/edit-branch.component';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent {


  emailExistsError = false;
	/*=============================================
	Creamos grupo de controles
	=============================================*/

	public fus = this.form.group({

    active       : 1,
    iduser       : 0,
    age          : 0,
    country      : '',
    displayName  : [''],
    email        : [''],
    method       : '',
    phone        : '',
    picture      : 'S/P',
    position     : [''],
    organization : [''],

   } )

   get age() { return this.fus.controls['age'] }
   get displayName() { return this.fus.controls['displayName'] }
   get country() { return this.fus.controls['country'] }
   get email() { return this.fus.controls['email'] }
   get phone() { return this.fus.controls['phone'] }
   get picture() { return this.fus.controls['picture'] }
   get position() { return this.fus.controls['position'] }
   get organization() { return this.fus.controls['organization'] }

  /*=============================================
	  Variable que valida el envío del formulario
	=============================================*/

	formSubmitted = false;

  /*----------------------------
    Variable para preCarga
   ----------------------------*/

  loadData = false;


  constructor( private form: FormBuilder, private usersService :UsersService,
    public dialogRef: MatDialogRef<EditComponent>, @Inject(MAT_DIALOG_DATA) public data: IDialogData ) { }

  ngOnInit( ): void {

        //Aqui inicializo con el item que voy a editar

     this.usersService.getItem(this.data.id).subscribe(
        (resp: any)=> {

              this.displayName.setValue(resp.displayName);
              this.age.setValue(resp.age);
              this.country.setValue(resp.country);
              this.email.setValue(resp.email);
              this.phone.setValue(resp.phone);
              this.picture.setValue(resp.picture);
              this.position.setValue(resp.position);
              this.organization.setValue(resp.organization);
        }

     )

  }


  editUsers(){

    this.loadData = true;

    this.formSubmitted = true;

    /*------------------------------
     Validamos que el formulario este correcto
    -----------------------*/

    /*=============================================
    Validamos y capturamos la informacion del formulario en la interfaz
    =============================================*/

    const email = this.fus.controls.email.value ?? '';

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

          this.loadData = false;

          /*=============================================
          Guardar en base de datos la info de la categoría
          =============================================*/
               this.usersService.patchData(this.data.id, dataUser, localStorage.getItem('token')).subscribe(
               resp=>{
                        this.dialogRef.close('save')
                         alerts.basicAlert("Ok", 'The User has been saved', "success")
                      },
                      err=>{

                        alerts.basicAlert("Error", 'User saving error', "error")

                      })

            }


    invalidField(field:string){
        return functions.invalidField(field, this.fus, this.formSubmitted);

    }


}


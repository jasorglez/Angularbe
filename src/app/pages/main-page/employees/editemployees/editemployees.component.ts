import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { Iemployees } from 'src/app/interface/iemployees';
import { EmployeesService } from 'src/app/services/employees.service';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';

import { StoragesService } from 'src/app/services/storages.service';
import { alerts } from 'src/app/helpers/alerts';

@Component({
  selector: 'app-editemployees',
  templateUrl: './editemployees.component.html',
  styleUrls: ['./editemployees.component.css']
})

export class EditemployeesComponent implements OnInit {

  selectedImage: File;

  formSubmitted = false;

  loadData = false;
  url : string = '' ;
  imageUrl: string = '';

  constructor( private formBuilder: FormBuilder,
              private storageService: StoragesService,
              private employeesServ : EmployeesService,
              public dialogRef: MatDialogRef<EditemployeesComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }


  public femployees = this.formBuilder.group({
    active       :  1,
    address      : '',
    age          :  [, [Validators.required, Validators.pattern('^(1[8-9]|[2-5][0-9]|6[0-9])$')]],
    country      :  ['MX',],
    colony       : '',
    city         : '',
    cp           :  '',
    curp         :  ['', [Validators.required]],
    email        :  ['', [Validators.required, Validators.email]],
    ident_emp     :  ['', [Validators.required]],
    name         :  ['', [Validators.required]],
    phone        :  ['',  [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    picture      :  '',
    rfc          :  ['', [Validators.required]],

   } )

   get city()      { return this.femployees.get('city')}
   get country()   { return this.femployees.get('country')}


  ngOnInit() {

   // console.log("this.id", this.data.id)

    this.employeesServ.getEmployeexid(this.data.id).subscribe(
      (resp: any) => {

        this.femployees.patchValue( {
          address   : resp.address,
          age       : resp.age,
          country   : resp.country,
          colony    : resp.colony,
          city      : resp.city,
          cp        : resp.cp,
          curp      : resp.curp,
          email     : resp.email,
          ident_emp : resp.identity,
          name     : resp.name,
          phone    : resp.phone,
          picture  : resp.picture,
          rfc      : resp.rfc
          
        })

        this.imageUrl = resp.picture ;
       // console.log("Resp", resp)

      })



  }


  saveEmployees() {

      this.loadData = true;

      this.formSubmitted = true;

      const dataEmployees: Iemployees = {
          salary       : 0,
          address      : this.femployees.get('address')?.value,
          age          : this.femployees.get('age')?.value,
          country      : this.femployees.get('country')?.value,
          colony       : this.femployees.get('colony')?.value,
          city         : this.femployees.get('city')?.value,
          cp           : this.femployees.get('cp')?.value,
          curp         : this.femployees.get('curp')?.value,
          email        : this.femployees.get('email')?.value,
          ident_emp    : this.femployees.get('identity')?.value,
          name         : this.femployees.get('name')?.value,
          phone        : this.femployees.get('phone').value,
          picture      : this.femployees.get('picture')?.value,
          rfc          : this.femployees.get('rfc')?.value,
          id_company   : localStorage.getItem('company')

    }

           this.loadData = false;

           this.employeesServ.patch(this.data.id, dataEmployees, localStorage.getItem('token')).subscribe(
            (resp: any) => { // Indicar que la respuesta es de tipo 'any'

                this.dialogRef.close('save');
              },
                  err=>{
                         alerts.basicAlert("Error", 'User saving error', "error")
                  }
           );
}


  uploadImage($event: any) {

    const file = $event.target.files[0];

    this.selectedImage = file;

    const path = `images/${this.storageService.generateRandom()}${file.name}`;


    if (!file) {
      this.imageUrl = ''; // No hay imagen seleccionada, establecemos la URL vacía
      return;
    }

    this.storageService.uploadFile(file, path)
      .then(url => {
          this.url = url;
          this.imageUrl = this.storageService.getObjectURL(this.selectedImage); // Almacenar la URL de la imagen seleccionada
          this.femployees.patchValue({ picture: url }); // Actualizar el valor del control 'picture' con la URL de la imagen
      })
      .catch(error => console.log("Error uploading file", error));
  }


}

import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { Iemployees } from 'src/app/interface/iemployees';
import { EmployeesService } from 'src/app/services/employees.service';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';

import { StoragesService } from 'src/app/services/storages.service';
import { alerts } from 'src/app/helpers/alerts';

@Component({
  selector: 'app-newemployees',
  templateUrl: './newemployees.component.html',
  styleUrls: ['./newemployees.component.css']
})
export class NewemployeesComponent implements OnInit {

  selectedImage: File;
  imageUrl: string = environment.urlProfile

  formSubmitted = false;
  loadData = false;

  url : string = '' ;

  constructor( private formBuilder: FormBuilder,
              private storageService: StoragesService,
              private employeesServ : EmployeesService,
              public dialogRef: MatDialogRef<NewemployeesComponent>,
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
     name         :  ['', [Validators.required]],
     email        :  ['', [Validators.required, Validators.email]],
     phone        :  ['',  [Validators.required, Validators.pattern('^[0-9]{10}$')]],
     picture      :  environment.urlProfile,
     rfc          :  ['', [Validators.required]],

   } )

   get city()      { return this.femployees.get('city')}
   get country()   { return this.femployees.get('country')}





  ngOnInit() {
    this.employeesServ.getEmployees(this.data.id).subscribe (
      (response : any )  => {

      })

  }


  saveEmployees() {

      this.loadData = true;

      this.formSubmitted = true;

      const dataEmployees: Iemployees = {
          active       : 1,
          address      : this.femployees.get('address')?.value,
          age          : this.femployees.get('age')?.value,
          country      : this.femployees.get('country')?.value,
          colony       : this.femployees.get('colony')?.value,
          city         : this.femployees.get('city')?.value,
          cp           : this.femployees.get('cp')?.value,
          curp         : this.femployees.get('curp')?.value,
          name         : this.femployees.get('name')?.value,
          email        : this.femployees.get('email')?.value,
          phone        : this.femployees.get('phone').value,
          picture      : this.femployees.controls.picture.value,
          rfc          : this.femployees.controls.rfc.value,
          id_company   : localStorage.getItem('company')

    }

           this.loadData = false;

           this.employeesServ.post(dataEmployees, localStorage.getItem('token')).subscribe(
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
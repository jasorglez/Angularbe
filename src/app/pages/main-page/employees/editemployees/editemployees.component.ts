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
    id           :  0,
    address      : '',
    age          :  [, [Validators.required, Validators.pattern('^(1[8-9]|[2-5][0-9]|6[0-9])$')]],
    country      :  ['MX',],
    colony       : '',
    city         : '',
    cp           :  '',
    curp         :  ['', ],
    email        :  ['', [Validators.required, Validators.email]],
    identity     :  ['', ],
    name         :  ['', [Validators.required]],
    phone        :  [''],
    picture      :  '',
    rfc          :  ['' ],

   } )

   get city()      { return this.femployees.get('city')}
   get country()   { return this.femployees.get('country')}


   ngOnInit() {

    this.employeesServ.getEmployeexid(this.data.id).subscribe(
      (resp: any) => {
       // console.log('Response:', resp);

        if (resp && typeof resp === 'object') {
          this.imageUrl = resp.picture;

          // Set values for form controls
          this.femployees.get('id')?.setValue(resp.id),
          this.femployees.get('identity')?.setValue(resp.ident_Emp),
          this.femployees.get('address')?.setValue(resp.address),
          this.femployees.get('colony')?.setValue(resp.colony),
          this.femployees.get('name')?.setValue(resp.name),
          this.femployees.get('email')?.setValue(resp.email)
          this.femployees.get('rfc')?.setValue(resp.rfc)
          this.femployees.get('phone')?.setValue(resp.phone)
          this.femployees.get('curp')?.setValue(resp.curp)
          this.femployees.get('age')?.setValue(resp.age)
          this.femployees.get('city')?.setValue(resp.city)
          this.femployees.get('country')?.setValue(resp.country)
        } else {
          console.error('Unexpected response structure:', resp);
        }
      },
      (error) => {
        console.error('Error fetching employee details:', error);
      },
      () => {
        console.log('Subscription completed');  // Log when the subscription is completed
      }
    );
  }


  saveEmployees() {

      this.loadData = true;

      this.formSubmitted = true;

      const dataEmployees: Iemployees = {
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
          salary       : 0
    }

           this.loadData = false;

           this.employeesServ.patch(this.data.id, dataEmployees, localStorage.getItem('token')).subscribe(
            (resp: any) => {
              console.log('Response from server:', resp);

              this.dialogRef.close('save');
              alerts.basicAlert("Success", 'User saved successfully', "success");
            },
            (error) => {
              console.error('Error saving employee:', error);
              alerts.basicAlert("Error", 'User saving error', "error");
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

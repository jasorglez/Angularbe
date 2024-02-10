import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { Iemployees } from 'src/app/interface/iemployees';
import { EmployeesService } from 'src/app/services/employees.service';
import { CatalogService } from 'src/app/services/catalog.service';
import { TrackingService } from 'src/app/services/tracking.service';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';

import { StoragesService } from 'src/app/services/storages.service';
import { alerts } from 'src/app/helpers/alerts';
import { catchError } from 'rxjs';

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

  directions : any[] = [];
  areas       : any[] = [] ;

  url : string = '' ;

  selectedDirection   : string = '';

  selectedAreaId  : string ;

  constructor( private formBuilder: FormBuilder,
              private storageService: StoragesService,
              private employeesServ : EmployeesService,
              private catalogService : CatalogService,
              private trackingService : TrackingService,
              public dialogRef: MatDialogRef<NewemployeesComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }


  public femployees = this.formBuilder.group({
     active       :  1,
     address      : '',
     age          :  ['30', [Validators.required, Validators.pattern('^(1[8-9]|[2-5][0-9]|6[0-9])$')]],
     country      :  ['MEXICO',],
     colony       : '',
     city         : 'TX',
     cp           :  '',
     curp         :  ['CURP',],
     name         :  ['', [Validators.required]],
     area         :  0,
     identity     :  ['', ],
     email        :  ['info@gmail.com', [Validators.required, Validators.email]],
     phone        :  ['', ],
     picture      :  environment.urlProfile,
     position     :  ['PUESTO', [Validators.required]],
     rfc          :  ['RFC'],

   } )

   get city()      { return this.femployees.get('city')}
   get country()   { return this.femployees.get('country')}

  ngOnInit() {
     this.getDirections() ;
  }

  getDirections()
  {

      this.catalogService.getdataDirections(localStorage.getItem('company')).subscribe((me) => {
        this.directions = Object.values(me);
      })
  }


  onDirectionSelected(event: Event): void {

    let passvalue : number = 0

    const target = event.target as HTMLSelectElement;

    passvalue = parseInt(target.value, 10);

    this.getpermissionxArea(passvalue);
  }

  getpermissionxArea(id: number) {
   //console.log(localStorage.getItem('company'));

   this.catalogService.getPermissionxArea(id, 1).subscribe((areas) => {
    this.areas = Object.values(areas);
    if (this.areas.length > 0) {


    }else{
       alerts.basicAlert("Error", "The user has not Areas asssigns", "error")
    }
  });

  }


  saveEmployees() {

      this.loadData = true;

      this.formSubmitted = true;

      const dataEmployees: Iemployees = {
          address      : this.femployees.get('address')?.value,
          age          : this.femployees.get('age')?.value,
          city         : this.femployees.get('city')?.value,
          colony       : this.femployees.get('colony')?.value,
          country      : this.femployees.get('country')?.value,
          cp           : this.femployees.get('cp')?.value,
          curp         : this.femployees.get('curp')?.value,
          email        : this.femployees.get('email')?.value,
          identEmp     : this.femployees.get('identity')?.value,
          area: Number(this.femployees.get('area')?.value),
          name         : this.femployees.get('name')?.value,
          phone        : this.femployees.get('phone').value,
          picture      : this.femployees.get('picture').value,
          position     : this.femployees.get('position').value,
          rfc          : this.femployees.get('rfc').value,
          salary       : 0,
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

import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { Iproviders } from 'src/app/interface/iproviders';
import { ProvidersService } from 'src/app/services/providers.service';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import {alerts } from  'src/app/helpers/alerts';

@Component({
  selector: 'app-newProv',
  templateUrl: './newProv.component.html',
  styleUrls: ['./newProv.component.css']
})
export class NewProvComponent implements OnInit {

  formSubmitted = false;
  loadData = false;

  url : string = '' ;

  constructor(private formBuilder: FormBuilder,
    private providersService : ProvidersService,
    public dialogRef: MatDialogRef<NewProvComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

    public fproviders = this.formBuilder.group({
      id           : 0 ,
      razonsocial  : ['', [Validators.required]],
      razoncorta   : [''],
      address      : '',
      cp           :  '',
      city         : 'TX',
      country      :  ['MX',],
      rfc          :  ['RFC'],
      email        :  ['info@gmail.com', [Validators.required, Validators.email]],
      phone        :  ['', ],

    } )

    get city()      { return this.fproviders.get('city')}
    get country()    { return this.fproviders.get('country')}


  ngOnInit() {

  }

  saveProviders()  {

      this.loadData = true;

      this.formSubmitted = true;

      const dataEmployees: Iproviders = {
          razonsocial  : this.fproviders.get('razonsocial')?.value,
          razoncorta   : this.fproviders.get('razoncorta')?.value,
          address      : this.fproviders.get('address')?.value,
          id_company   : localStorage.getItem('company'),
          cp           : this. fproviders.get('cp')?.value,
          city         : this.fproviders.get('city')?.value,
          country      : this.fproviders.get('country')?.value,
          rfc          : this. fproviders.controls.rfc.value,
          email        : this. fproviders.get('email')?.value,
          phone        : this. fproviders.get('phone').value,
      }

           this.loadData = false;

           this.providersService.post(dataEmployees, localStorage.getItem('token')).subscribe(
            (resp: any) => { // Indicar que la respuesta es de tipo 'any'

                this.dialogRef.close('save');
              },
                  err=>{
                         alerts.basicAlert("Error", 'User saving error', "error")
                  }
           );
   }




}

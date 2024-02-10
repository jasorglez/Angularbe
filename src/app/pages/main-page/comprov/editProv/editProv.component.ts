import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { Iproviders } from 'src/app/interface/iproviders';
import { ProvidersService } from 'src/app/services/providers.service';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import {alerts } from  'src/app/helpers/alerts';

@Component({
  selector: 'app-editProv',
  templateUrl: './editProv.component.html',
  styleUrls: ['./editProv.component.css']
})
export class EditProvComponent implements OnInit {

  formSubmitted = false;
  loadData = false;

  url : string = '' ;

  constructor(private formBuilder: FormBuilder,
    private providersService : ProvidersService,
    public dialogRef: MatDialogRef<EditProvComponent>,
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

     this.providersService.getProvidersxid(this.data.id).subscribe(
      (resp: any) => {
       console.log('Response:', resp);

          // Set values for form controls
          this.fproviders.get('id')?.setValue(resp.id),
          this.fproviders.get('razonsocial')?.setValue(resp.razonsocial),
          this.fproviders.get('razoncorta')?.setValue(resp.razoncorta),
          this.fproviders.get('address')?.setValue(resp.address),
          this.fproviders.get('cp')?.setValue(resp.cp)
          this.fproviders.get('city')?.setValue(resp.city)
          this.fproviders.get('country')?.setValue(resp.country)
          this.fproviders.get('rfc')?.setValue(resp.rfc)
          this.fproviders.get('email')?.setValue(resp.email)
          this.fproviders.get('phone')?.setValue(resp.phone)
      },
      (error) => {
        console.error('Error fetching Providers Details:', error);
      },
      () => {

      });
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

         this.providersService.patch(this.data.id, dataEmployees, localStorage.getItem('token')).subscribe(
          (resp: any) => { // Indicar que la respuesta es de tipo 'any'
              this.dialogRef.close('save');
              alerts.basicAlert("Success", 'User saved successfully', "success");
            },
                err=>{
                       alerts.basicAlert("Error", 'User saving error', "error")
                }
         );
 }


}

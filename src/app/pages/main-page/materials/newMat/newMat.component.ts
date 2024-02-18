import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';

import { Imaterials } from 'src/app/interface/imaterials';
import { MaterialsService } from 'src/app/services/materials.service';
import { CatalogService } from 'src/app/services/catalog.service';

import { StoragesService } from 'src/app/services/storages.service';
import { alerts } from 'src/app/helpers/alerts';

@Component({
  selector: 'app-newMat',
  templateUrl: './newMat.component.html',
  styleUrls: ['./newMat.component.css']
})
export class NewMatComponent implements OnInit {

  selectedImage: File;
  imageUrl: string = environment.urlProfile

  formSubmitted = false;
  loadData = false;

  measures  : any[] = [] ;
  familys   : any[] = [] ;
  ubications : any[] = [] ;

  url : string = '' ;

  estaActivo: boolean = false;

  constructor(private formBuilder: FormBuilder,
              private storagesService  : StoragesService,
              private materialsService : MaterialsService,
              private catalogService   : CatalogService,
              public dialogRef: MatDialogRef<NewMatComponent>,
              @Inject(MAT_DIALOG_DATA) public data:any) { }

  public fsupplies = this.formBuilder.group({
    insumos      :  ['', [Validators.required]],
    articulo     : '',
    date: new FormControl(new Date().toISOString().substring(0, 10)), // Formato YYYY-MM-DD
    measure      : 0,
    family       : 0,
    ubication    : 0,
    costoMN      : 0,
    costoDLL     : 0,
    ventaMN      : 0,
    ventaDLL     : 0,
    picture      :  environment.urlProfile,
    description  : '',
  } )

  ngOnInit() {
    this.getMedidas();
    this.getFamilys();
    this.getUbications();
  }

  toggleCheckbox() {
    this.estaActivo = !this.estaActivo;
  }

  getMedidas()
  {
      this.catalogService.getdataMeasures().subscribe((me) => {
        this.measures = Object.values(me);
      })
  }


  getFamilys()
  {
    this.catalogService.getdataFamilys().subscribe((me) => {
      this.familys = Object.values(me);
    })
  }


  getUbications()
  {
    this.catalogService.getdataUbications().subscribe((me) => {
      this.ubications = Object.values(me);
    })

  }

  save() {

    this.loadData = true;

    this.formSubmitted = true;

    const data: Imaterials = {
        insumo       : this.fsupplies.get('insumos')?.value,
        articulo     : this.fsupplies.get('articulo')?.value,
        idCompany   : localStorage.getItem('company'),
        idFamilia   : this.fsupplies.controls.family.value ?? 0,
        idMedida    : this.fsupplies.controls.measure.value ?? 0,
        idUbication : this.fsupplies.controls.ubication.value ?? 0,
        description  : this.fsupplies.get('description')?.value,
        date         : new Date(this.fsupplies.get('date').value),
        costoMN      : this.fsupplies.get('costoMN')?.value,
        costoDLL     : this.fsupplies.get('costoDLL')?.value,
        ventaMN      : this.fsupplies.get('ventaMN')?.value,
        ventaDLL     : this.fsupplies.get('ventaDLL')?.value,
        picture      : this.fsupplies.controls.picture.value,
        aplicaResg   : this.estaActivo
  }
         this.loadData = false;

         console.log("DATA", data) ;

         this.materialsService.post(data, localStorage.getItem('token')).subscribe(
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

  const path = `images/${this.storagesService.generateRandom()}${file.name}`;


  if (!file) {
    this.imageUrl = ''; // No hay imagen seleccionada, establecemos la URL vacía
    return;
  }

  this.storagesService.uploadFile(file, path)
    .then(url => {
        this.url = url;
        this.imageUrl = this.storagesService.getObjectURL(this.selectedImage); // Almacenar la URL de la imagen seleccionada
        this.fsupplies.patchValue({ picture: url }); // Actualizar el valor del control 'picture' con la URL de la imagen
    })
    .catch(error => console.log("Error uploading file", error));
}


}

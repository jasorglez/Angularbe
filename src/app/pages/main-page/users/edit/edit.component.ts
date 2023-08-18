import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { functions } from 'src/app/helpers/functions';
import { TrackingService } from 'src/app/services/tracking.service';
import { Iusers } from 'src/app/interface/iusers';
import { Icompany } from 'src/app/interface/icompany';
import { Ibranch } from'src/app/interface/ibranch'
import { Iproject } from 'src/app/interface/iproject';

import { UsersService } from '../../../../services/users.service';
import { CompanysService } from 'src/app/services/companys.service';
import { BranchsService } from 'src/app/services/branchs.service';
import { ProjectService } from 'src/app/services/project.service';
import { StoragesService } from 'src/app/services/storages.service';
import { CatalogService } from 'src/app/services/catalog.service';

import { environment } from 'src/environments/environment';
import { alerts } from 'src/app/helpers/alerts';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent {

  selectedorganization: string = '';

  stateData         : any[]  = [] ;
  organizationData  : any[]  = [] ;

  emailExists: boolean = false;

  isInputDisabled = true;

  eml : string = '' ;

  emailExistsError = false;

  selectedTab = this.data.formType;

onTabSelected(tabName: string) {
  this.selectedTab = tabName;

  if (tabName=== 'users') {
      this.trackingService.addLog(localStorage.getItem('company'),
      'Click en la Pestaña Users/Usuarios del menu Usuarios', 'Usuarios', '')
      this.getUsers();
   }

  if (tabName=== 'companys') {
      this.trackingService.addLog(localStorage.getItem('company'), 'Click en la Pestaña Company/Empresas del menu Usuarios', 'Usuarios', '')
      this.getCompanys()
  }

  if (tabName=== 'branchs') {
      this.trackingService.addLog(localStorage.getItem('company'), 'Click en la Pestaña Branchs/Sucursales del menu Usuarios', 'Usuarios', '')
    //  this.getdataBranchs()
  }

  if (tabName=== 'projects') {
      this.trackingService.addLog(localStorage.getItem('company'), 'Click en la Pestaña Projects/Proyectos del menu Usuarios', 'Usuarios', '')
     // this.getdataProjects()
    }

  if (tabName=== 'settings') {
      this.trackingService.addLog(localStorage.getItem('company'), 'Click en la Pestaña Settings/Seguimiento del menu Usuarios', 'Usuarios', '')
     // this.getdataTracking()
    }

    }


	public fus = this.formBuilder.group({

    active       :  1,
    iduser       :  0,
    age          :  [, [Validators.required, Validators.pattern('^(1[8-9]|[2-5][0-9]|6[0-9])$')]],
    country      :  ['', [Validators.required]],
    displayName  :  ['', [Validators.required]],
    emailu       :  {value: 'email', disabled:true},
    method       :  '',
    passnew      :  {value :'', disabled:true },
    phone        :  ['',  [Validators.required, Validators.pattern(/^\d{10}$/)]],
    picture      :  '',
    position     :  ['', Validators.required],
    organization :  '',

   } )

   get activef()       { return this.fus.get('active') }
   get iduserf()       { return this.fus.get('iduser') }
   get agef()          { return this.fus.get('age') }
   get countryf()      { return this.fus.get('country')}
   get namef()         { return this.fus.get('displayName') }
   get emailf()        { return this.fus.get('emailu') }
   get methodf()       { return this.fus.get('method') }
   get passnewf()      { return this.fus.get('passnew') }
   get phonef()        { return this.fus.get('phone') }
   get picturef()      { return this.fus.get('picture') }
   get positionf()     { return this.fus.get('position') }
   get organizationf() { return this.fus.get('organization') }


  public fcompanys = this.formBuilder.group({
    addressc      :  '',
    cityc         :  ['', [Validators.required]],
    countryc      :  ['', [Validators.required]],
    displayNamec  :  ['', [Validators.required]],
    emailc        :  ['', [Validators.required, Validators.email]],
    names         :  ['', [Validators.required]],
    formatrep     :  ['', [Validators.required]],
    phonec        :  ['',  [Validators.required, Validators.pattern(/^\d{10}$/)]],
    picturec      :  [''],
    rfcc          :  ['', Validators.required],
    state         :  '',

 } )

 get namefc()    { return this.fcompanys.get('displayNamec') }
 get cityfc()    { return this.fcompanys.get('cityc')}
 get countryfc() { return this.fcompanys.get('countryc')}



public fbranchs = this.formBuilder.group({
   localityb    :  ['', [Validators.required]],
   colonyb      :  '',
   countryb     :  ['Mexico',],
   cpb          :  '',
   dnameb       :  ['', [Validators.required]],
   stateb       :  '',
   streetb      : '',
} )


 public fprojects = this.formBuilder.group({
  codep        : ['', [Validators.required, Validators.minLength(3), Validators.pattern('[A-Z0-9]{3,}')]],
  contractp    : ['', [Validators.required, Validators.minLength(3), Validators.pattern('[A-Z0-9]{3,}'), Validators.required]],
  descriptionp : ['', [Validators.required]],
  imagep       : [''],
  tenderp      : ['', [Validators.required]],
  ubicationp   : '',
  dStart       : [''],
  dEnd         : [''],
 });

  	formSubmitted = false;
   idBranch   : string = '' ;
   companyId  : string = '' ;
   loadData   = false;
   url        : string = '';
   initialUrl : string = '' ;
   imageUrl   : string = '';
   pass       : '' ;

  constructor( private storageService  : StoragesService,
               private usersService    : UsersService,
               private companysService : CompanysService,
               private branchsService  : BranchsService,
               private projectsService : ProjectService ,
               private catalogsService: CatalogService,
               private trackingService : TrackingService,
               private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<EditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any ) { }

   ngOnInit() {

   //Aqui inicializo con el item que voy a editar
   this.getStates();

   this.getOrganizations();

   this.selectedTab = this.data.formType

    if (this.data.formType === 'users') {   this.getUsers()  }

    if (this.data.formType === 'companys') {  this.getCompanys()  }

    if (this.data.formType === 'branchs') { this.getBranchs()  }

      if (this.data.formType === 'projects') {  this.getProjects() ;  }
  }


  getUsers() {

    this.usersService.getItem(this.data.id).subscribe(
      (resp: any)=> {

            this.imageUrl = resp.picture ;
            this.activef.setValue(resp.active);
            this.iduserf.setValue(resp.iuser);
            this.namef.setValue(resp.displayName);
            this.agef.setValue(resp.age);
            this.countryf.setValue(resp.country);
            this.emailf.setValue(resp.emailu);
            this.methodf.setValue(resp.method);
            this.passnewf.setValue(resp.password);
            this.phonef.setValue(resp.phone);
            this.picturef.setValue(resp.picture);
            this.positionf.setValue(resp.position);
            this.organizationf.setValue(resp.organization);
      }

   )

  }

  getCompanys(){

      this.companysService.getEmpresa(this.data.id).subscribe(
      (resp:any)=>{

        this.imageUrl = (resp.picture);

        this.fcompanys.patchValue({
          addressc      : resp.address,
          cityc         : resp.city,
          countryc      : resp.country,
          displayNamec  : resp.displayName,
          names         : resp.namesmall,
          emailc        : resp.email,
          formatrep     : resp.formatrep,
          phonec        : resp.phone,
          picturec      : resp.picture,
          rfcc          : resp.rfc,
          state         : resp.state,
        });

    }
    )
  }

  getBranchs() {

    this.branchsService.getItem(this.data.id).subscribe(
      (resp:any)=>{

        this.companyId = resp.id_company;

        this.fbranchs.patchValue({
          localityb  : resp.locality,
          colonyb    : resp.colony,
          countryb   : resp.country,
          cpb        : resp.cp,
          dnameb     : resp.name,
          stateb     : resp.state,
          streetb    : resp.street
        });

    }
    )

  }

  getProjects() {
    // console.log(this.data.id)
    this.projectsService.getItem(this.data.id).subscribe(
      (resp:any)=>{

        this.imageUrl = (resp.image);
        this.idBranch = resp.id_branch ;

        let date = new Date(resp.dStart);
        let formattedStart = date.getUTCFullYear() + '-' +
          ('0' + (date.getUTCMonth() + 1)).slice(-2) + '-'
          + ('0' + date.getUTCDate()).slice(-2);

          let date2 = new Date(resp.dEnd);
          let formattedEnd = date2.getUTCFullYear() + '-' +
            ('0' + (date2.getUTCMonth() + 1)).slice(-2) + '-'
            + ('0' + date2.getUTCDate()).slice(-2);

        this.fprojects.patchValue({
          codep        : resp.code,
          contractp    : resp.contract,
          descriptionp : resp.description,
          imagep       : resp.image,
          tenderp      : resp.tender,
          ubicationp   : resp.ubication,
          dStart       : formattedStart,
          dEnd         : formattedEnd
        });
      //console.log(resp)
    }
    )

  }


  getStates(){
    this.catalogsService.getdataStates().subscribe(( state) => {
      this.stateData = Object.values(state)
     // console.log(this.stateData)
     })
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



uploadImage($event: any) {

  this.eml = this.fus.get('emailu').value ;

  const file = $event.target.files[0];

  this.selectedImage = file;

  const path = `images/${this.eml}${file.name}`;

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



    editUsers(){

    this.loadData = true;
    this.formSubmitted = true;
    const email = this.fus.get('emailu').value;

              const dataUser: Iusers = {
              active         : 1,
              iduser         : 0,
              method         : '',
              age            : this.fus.get('age').value ,
              country        : this.fus.get('country').value,
              displayName    : this.fus.get('displayName').value,
              emailu         : email,
              password       : this.fus.get('passnew').value,
              phone          : this.fus.get('phone').value,
              picture        : this.fus.get('picture').value,
              position       : this.fus.get('position').value,
              organization   : this.fus.get('organization').value
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

    editCompanys(){

        this.loadData = true;

        this.formSubmitted = true;

             const dataCompany  : Icompany = {
                    address     : this.fcompanys.get('addressc')?.value,
                    city        : this.fcompanys.get('cityc').value,
                    country     : this.fcompanys.get('countryc').value,
                    displayName : this.fcompanys.get('displayNamec').value ,
                    email       : this.fcompanys.get('emailc')?.value ,
                    namesmall   : this.fcompanys.get('names')?.value,
                    phone       : this.fcompanys.get('phonec')?.value,
                    picture     : this.fcompanys.get('picturec')?.value,
                    formatrep   : this.fcompanys.get('formatrep')?.value,
                    rfc         : this.fcompanys.get('rfcc')?.value,
                    state       : this.fcompanys.get('statec')?.value
                }

                this.loadData = false;

                this.companysService.patchData(this.data.id, dataCompany, localStorage.getItem('token')).subscribe( resp=>{

                      this.dialogRef.close('save')
                      alerts.basicAlert("Ok", 'The company has been saved', "success")
                }),
                  err=>{
                         alerts.basicAlert("Error", 'Company saving error', "error")
                       }

    }

    editBranchs() {
      if (this.fbranchs.invalid)  {
        this.fbranchs.markAllAsTouched();
      }

      this.loadData = true;

      this.formSubmitted = true;

           const dataBranch   : Ibranch = {
                 active      : 1,
                 colony      : this.fbranchs.get('colonyb')?.value,
                 country     : this.fbranchs.get('countryb')?.value,
                 cp          : parseInt(this.fbranchs.get('cpb')?.value, 10),
                 idbra       : 0,
                 id_company  : this.companyId,
                 locality    : this.fbranchs.get('localityb')?.value,
                 name        : this.fbranchs.get('dnameb')?.value ,
                 state       : this.fbranchs.get('stateb')?.value,
                 street      : this.fbranchs.get('streetb')?.value,
              }

              this.loadData = false;

              this.branchsService.patchData(this.data.id, dataBranch, localStorage.getItem('token')).subscribe( resp=>{

                    this.dialogRef.close('save')
                    alerts.basicAlert("Ok", 'The Branch has been saved', "success")
              }),
                err=>{
                       alerts.basicAlert("Error", 'Branch saving error', "error")
                     }
    }

    editProjects(){
      if (this.fprojects.invalid)  {
        this.fprojects.markAllAsTouched() }

      this.loadData = true;
      this.formSubmitted = true;

      const dataProject : Iproject = {
          code         : this.fprojects.get('codep')?.value,
          contract     : this.fprojects.get('contractp')?.value,
          description  : this.fprojects.get('descriptionp')?.value,
          id_branch    : this.idBranch,
          image        : this.url,
          tender       : this.fprojects.get('tenderp')?.value,
          ubication    : this.fprojects.get('ubicationp')?.value,
          dStart       : new Date(this.fprojects.get('dStart')?.value),
          dEnd         : new Date(this.fprojects.get('dEnd')?.value)
       }

     this.loadData = false;
     this.projectsService.patchData(this.data.id, dataProject, localStorage.getItem('token')).subscribe( resp=>{

           this.dialogRef.close('save')
           alerts.basicAlert("Ok", 'The Project has been saved', "success")
     }),
       err=>{
              alerts.basicAlert("Error", 'Project saving error', "error")
            }

    }


    invalidField(field:string){
        return functions.invalidField(field, this.fus, this.formSubmitted);

    }


}


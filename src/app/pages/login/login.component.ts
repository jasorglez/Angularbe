import { Component, OnInit } from '@angular/core';
import { FormsModule, FormBuilder, Validators } from '@angular/forms'

import { Ilogin } from 'src/app/interface/ilogin';
import { LoginService } from 'src/app/services/login.service';
import { CompanysService } from 'src/app/services/companys.service';
import { TrackingService } from 'src/app/services/tracking.service';

import { functions } from 'src/app/helpers/functions';
import { alerts } from 'src/app/helpers/alerts';
import { Router } from '@angular/router';

import { TraductorService} from 'src/app/services/traductor.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{


  emailcapt : string = '';

 /*=============================================
	Creamos grupo de controles
	=============================================*/

	public f = this.form.group({

		email: ['', [Validators.required, Validators.email]],
		password: ['', Validators.required]

	})

	/*=============================================
	Variable que valida el envío del formulario
	=============================================*/

	formSubmitted = false;

  valorcapturado = '' ;



  constructor( public translateService: TraductorService, private form: FormBuilder, private loginService: LoginService,
    private companysService : CompanysService, private trackingService : TrackingService, private router: Router) { }


  ngOnInit(): void {

  }



	/*=============================================
	Función Login
	=============================================*/

	login(){

		/*=============================================
		Validamos que el formulario haya sido enviado
		=============================================*/


    this.formSubmitted = true;

   // Atrapo la variable para enviarla al servicio
   this.emailcapt = this.f.get('email')?.value || '';

   this.trackingService.setEmail(this.f.controls.email.value ?? '' );

    if(this.f.invalid){

			return;
		}

    /*=============================================
		Capturamos la información del formulario en la interfaz
		=============================================*/

		const data: Ilogin = {

			email: this.f.controls.email.value ?? '',
			password: this.f.controls.password.value ?? '',
			returnSecureToken: true

		}

		/*=============================================
		Ejecutamos el servicio del Login
		=============================================*/

     this.trackingService.addLog('', "Inicio del Sistema ", "Origen del Formulario Login", this.emailcapt)


		this.loginService.login(data).subscribe(

			(resp)=>{

				/*=============================================
				Entramos al sistema
				=============================================*/

        this.router.navigateByUrl("/");

			},

			(err)=>{

				/*=============================================
				Errores al intentar entrar al sistema
				=============================================*/

				if(err.error.error.message == "EMAIL_NOT_FOUND"){

					alerts.basicAlert("Error", 'Invalid email', "error")

				}else if(err.error.error.message == "INVALID_PASSWORD"){

					alerts.basicAlert("Error", 'Invalid password', "error")

				}else{

					alerts.basicAlert("Error", "An error occurred", "error")
				}

			}

		);

  }


  	/*=============================================
	Validamos formulario
	=============================================*/

	invalidField(field:string){

		return functions.invalidField(field, this.f, this.formSubmitted);

	}

}

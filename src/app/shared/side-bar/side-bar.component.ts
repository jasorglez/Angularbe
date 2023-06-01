import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { TraductorService} from 'src/app/services/traductor.service';
import { TrackingService } from 'src/app/services/tracking.service';
import { CompanysService } from 'src/app/services/companys.service';

import { get } from 'firebase/database';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {

  email   : string = '' ;

  constructor(public translateService: TraductorService, public trackingService : TrackingService, public companyService : CompanysService,
    private router: Router) { }



        home() {
          this.trackingService.addLog('', 'Eleccion del menu Home/Inicio', 'Menu Side Bar', '')
          this.router.navigate(['/']);
         }
      
      
        navigateToBranchs()  {
          this.trackingService.addLog('', 'Eleccion del menu Branchs/Sucursales', 'Menu Side Bar', '')
          this.router.navigate(['/branchs']);
        }
      
      
         navigateToUsers()  {
          this.trackingService.addLog('', 'Eleccion del menu Users/Usuarios', 'Menu Side Bar', '')
          this.router.navigate(['/users']);
        }
      
        navigateToCompanys()  {
          this.router.navigate(['/companys']);
        }
      
        navigateToInterested()  {
          this.router.navigate(['/interested']);
        }
      
      	ngOnInit(): void  {
    
         }

    /*=============================================
	Función de salida del sistema
	=============================================*/
	logout(){
    this.trackingService.addLog('', 'Salio del Sistema - Cierre de sesion', 'Menu Side Bar', '')
		localStorage.removeItem('token');
		localStorage.removeItem('refreshToken');
		this.router.navigateByUrl("/login");
	}

}

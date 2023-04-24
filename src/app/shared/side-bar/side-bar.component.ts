import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { TraductorService} from 'src/app/services/traductor.service';


@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {


  constructor(public translateService: TraductorService, private router: Router) { }


  home() {
    this.router.navigate(['/']);
   }


  navigateToBranchs()  {

    this.router.navigate(['/branchs']);

  }


   navigateToUsers()  {
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

		localStorage.removeItem('token');
		localStorage.removeItem('refreshToken');
		this.router.navigateByUrl("/login");
	}

}

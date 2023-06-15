import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { TraductorService} from 'src/app/services/traductor.service';
import { TrackingService } from 'src/app/services/tracking.service';
import { CompanysService } from 'src/app/services/companys.service';
import { AuthService } from 'src/app/services/auth.service';

import { get } from 'firebase/database';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {

   mail            : string = '' ;

   companyData     : any[]  = [] ;
   branchData      : any[]  = [] ;
   projectData     : any[]  = [] ;

   selectedCompany : string ;
   selectedBranch  : string ;
   selectedProject : string ;

  constructor(public translateService: TraductorService, public trackingService : TrackingService, public companysService : CompanysService, public authService : AuthService,
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

        navigateToCommunications()  {
          this.router.navigate(['/communications']);
        }

      	ngOnInit(): void  {
            this.mail = this.trackingService.getEmail()
            this.getpermissionxCompanys() ;
         }

         onSelectCompany(): void {
          console.log('Id Compnay ->', this.selectedCompany);
          this.trackingService.setCompany(this.selectedCompany);
          this.getpermissionxBranchs();
        }

        onSelectBranch() {
          console.log('Id Branch ->', this.selectedBranch);
          this.trackingService.setBranch(this.selectedBranch) ;
          this.getpermissionxProjects();
        }

        onSelectProject() {
          this.trackingService.setProject(this.selectedProject)
          console.log('Id Project ->', this.selectedProject);
        }


      //obtener los permisos de la cia
        getpermissionxCompanys() {
          this.companysService.getpermissionsxCompany(this.mail).subscribe((data) => {
            this.companyData = Object.values(data);
            if (this.companyData.length > 0) {
              this.selectedCompany = this.companyData[0].id_company; // Establecer el primer valor como seleccionado
              this.getpermissionxBranchs();
            }
          });
        }

        getpermissionxBranchs() {
          this.companysService.getpermissionsxBranch(this.selectedCompany).subscribe((data) => {
            this.branchData = Object.values(data);
            if (this.branchData.length > 0) {
              this.selectedBranch = this.branchData[0].id_branchs; // Establecer el primer valor como seleccionado
              this.getpermissionxProjects();
            }
          });
        }


        getpermissionxProjects() {
          this.companysService.getpermissionsxProject(this.selectedBranch).subscribe((data) => {
            this.projectData = Object.values(data);
            if (this.projectData.length > 0) {
              this.selectedProject = this.projectData[0].id_projects; // Establecer el primer valor como seleccionado
              this.onSelectProject()
            } else {
              this.selectedProject = null; // No hay projects disponibles, se establece como null
            }
          });
        }



}

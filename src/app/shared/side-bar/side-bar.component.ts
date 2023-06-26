import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { TraductorService} from 'src/app/services/traductor.service';
import { TrackingService } from 'src/app/services/tracking.service';
import { CompanysService } from 'src/app/services/companys.service';
import { AuthService } from 'src/app/services/auth.service';

import { alerts } from 'src/app/helpers/alerts';

import { get } from 'firebase/database';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {

   companyData     : any[]  = [] ;
   branchData      : any[]  = [] ;
   projectData     : any[]  = [] ;

   selectedCompany   : string = '';
   selectedProjectId : string ;
   selectedBranchId  : string ;

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

        navigateToCompanys()  {
          this.router.navigate(['/companys']);
        }

         navigateToUsers()  {
          this.trackingService.addLog('', 'Eleccion del menu Users/Usuarios', 'Menu Side Bar', '')
          this.router.navigate(['/users']);
        }

        navigateToInterested()  {
          this.router.navigate(['/interested']);
        }

        navigateToCommunications()  {
          this.router.navigate(['/communications']);
        }


      	ngOnInit(): void  {
              this.getpermissionxCompanys() ;
         }



      //empiezan los procedimientos para las llamadas de los combobox
      //obtener los permisos de la cia
      getpermissionxCompanys() {

          this.companysService.getpermissionsxCompany(this.trackingService.getEmail()).subscribe((data) => {
            this.companyData = Object.values(data);

            if (this.companyData.length > 0) {
              this.selectedCompany = this.companyData[0].id_company;
              this.trackingService.setCompany(this.selectedCompany);
              this.getpermissionxBranchs();
            }

           });
        }

        onCompanysSelected(event: Event): void {
          const target = event.target as HTMLSelectElement;
          this.selectedCompany = target.value;
          this.getpermissionxBranchs();
        }


        getpermissionxBranchs() {

          this.companysService.getpermissionsxBranch(this.selectedCompany, this.trackingService.getEmail()).subscribe((databranch) => {
            this.branchData = Object.values(databranch);
            if (this.branchData.length > 0) {

              this.selectedBranchId = this.branchData[0].id_branchs ;
              this.trackingService.setBranch(this.selectedBranchId) ;
              this.getpermissionxProjects();
            }else{
               alerts.basicAlert("Error", "The user has not Branchs asssigns", "error")
            }

          });
        }

        onBranchsSelected(event: Event): void {
          const target = event.target as HTMLSelectElement;
          this.selectedBranchId = target.value;
          this.getpermissionxProjects();
        }


        // Datos de Projectos

        getpermissionxProjects(): void {
          this.companysService.getpermissionsxProject(this.selectedBranchId).subscribe((data) => {

            this.projectData = Object.values(data);
            if (this.projectData.length > 0) {
               this.selectedProjectId = this.projectData[0].id_projects ;
               this.trackingService.setProject(this.selectedProjectId) ;
            }
            else
            {
              alerts.basicAlert("Error", "No existen Proyectos para este usuario.", "error");
            }
          });
        }

        onProjectSelected(event: Event): void {
          const target = event.target as HTMLSelectElement;
          this.selectedProjectId = target.value;
          this.trackingService.setProject(this.selectedProjectId) ;
        }



}

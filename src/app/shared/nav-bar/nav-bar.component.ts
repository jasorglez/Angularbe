import { Component } from '@angular/core';

import { CompanysService } from 'src/app/services/companys.service';
import { TrackingService } from 'src/app/services/tracking.service';


@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {

  mail            : string = '' ;
  company         : string = '' ;
  branch          : string = '' ;

  companyData     : any[]  = [] ;
  branchData      : any[]  = [] ;
  projectData     : any[]  = [] ;

  selectedCompany : any ;
  selectedBranch  : any ;
  selectedProject : any ;

  constructor( private companysService :CompanysService, private trackingService : TrackingService  ) { }

  ngOnInit( ): void {

    this.mail = this.trackingService.getEmail()
    this.getpermissionxCompanys() ;
  }


  onSelectCompany(): void {
    console.log('Id Company ->', this.selectedCompany);
    this.getpermissionxBranchs();
  }

  onSelectBranch() {
    console.log('Id Branch ->', this.selectedBranch);
    this.getpermissionxProjects();
  }

  onSelectProject() {
    console.log('Id Project ->', this.selectedBranch);
  }

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
      } else {
        this.selectedProject = null; // No hay projects disponibles, se establece como null
      }
    });
  }


}

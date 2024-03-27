import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


//componentes
import { InspectionsComponent } from './inspections.component';

const routes: Routes = [
  { path: '', component: InspectionsComponent  }
];


@NgModule({
  imports : [RouterModule.forChild(routes)],
  exports : [RouterModule]
})

export class InspectionsRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


//componentes
import { SapequiposComponent } from './sapequipos.component';

const routes: Routes = [
  { path: '', component: SapequiposComponent  }
];


@NgModule({
  imports : [RouterModule.forChild(routes)],
  exports : [RouterModule]
})

export class SapequiposRoutingModule { }

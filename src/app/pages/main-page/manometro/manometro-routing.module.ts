import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//componentes
import  { ManometroComponent } from './manometro.component' ;

const routes: Routes = [
  { path: '', component: ManometroComponent  }
];


@NgModule({
  imports : [RouterModule.forChild(routes)],
  exports : [RouterModule]
})

export class ManometroRoutingModule { }

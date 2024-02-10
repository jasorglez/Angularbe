import { Routes, RouterModule } from '@angular/router';
import { ComprovComponent } from './comprov.component';
import { NgModule } from '@angular/core';


const routes: Routes = [
  { path: '', component: ComprovComponent }
];

@NgModule({
imports: [RouterModule.forChild(routes)],
exports: [RouterModule]
})
export class ComprovRoutingModule { }

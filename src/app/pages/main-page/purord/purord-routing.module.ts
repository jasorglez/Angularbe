import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//componentes
import { PurordComponent } from './purord.component';

const routes: Routes = [
	{ path: '', component: PurordComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurordRoutingModule { }

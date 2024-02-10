import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DialogCustomComponent } from './dialogCustom.component';

const routes: Routes = [
  { path: '', component: DialogCustomComponent  }
];

@NgModule({
imports: [RouterModule.forChild(routes)],
exports: [RouterModule]
})
export class dialogCustomRoutingModule { }


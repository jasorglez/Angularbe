import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BranchsComponent } from './branchs.component';

import { BranchsRoutingModule } from './branchs-routing.module';

@NgModule({
  declarations: [BranchsComponent],
  imports: [
    CommonModule, BranchsRoutingModule
  ]
})
export class BranchsModule { }









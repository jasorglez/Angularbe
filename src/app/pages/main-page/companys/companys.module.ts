import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompanysRoutingModule } from './companys-routing.module';

import { CompanysComponent } from './companys.component';

//Angular Material
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';


@NgModule({
  declarations: [CompanysComponent],
  imports: [
    CommonModule,
    CompanysRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule
  ]
})
export class CompanysModule { }

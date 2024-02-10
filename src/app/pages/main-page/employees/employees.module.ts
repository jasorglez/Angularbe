import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeesRoutingModule } from './employees-routing.module';

//Angular Material
import { MatTableModule } from '@angular/material/table';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule }  from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';

import { ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';

import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';


import { TranslateModule } from '@ngx-translate/core'
import { EmployeesComponent } from './employees.component';
import { NewemployeesComponent } from './newemployees/newemployees.component';
import { EditemployeesComponent } from './editemployees/editemployees.component';
import { ResguardsComponent } from './resguards/resguards.component';


@NgModule({
  declarations: [EmployeesComponent, NewemployeesComponent, EditemployeesComponent, ResguardsComponent],
  imports: [
    EmployeesRoutingModule,
    CommonModule,
    TranslateModule,
    MatTableModule,

    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatDialogModule,
    
    ReactiveFormsModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,


    MatTooltipModule
  ]
})

export class EmployeesModule { }

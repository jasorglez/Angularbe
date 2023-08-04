import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core'

import { EmployeesComponent } from './employees.component';
import { NewemployeesComponent } from './newemployees/newemployees.component';
import { EditemployeesComponent } from './editemployees/editemployees.component';

import { EmployeesRoutingModule } from './employees-routing.module';

//Angular Material
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';

import { MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [EmployeesComponent, NewemployeesComponent, EditemployeesComponent],
  imports: [
    EmployeesRoutingModule,
    CommonModule,
    TranslateModule,
    MatTableModule,
    MatIconModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatTooltipModule
  ]
})

export class EmployeesModule { }

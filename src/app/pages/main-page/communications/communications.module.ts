import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommunicationsComponent } from './communications.component';
import { NewcommunicComponent } from './newcommunic/newcommunic.component';

import { TranslateModule } from '@ngx-translate/core';

import { CommunicationsRoutingModule } from './communications.routing';

// estos 3 son forzosos para la paginacion y la conexion del data table
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';


@NgModule({
  declarations: [CommunicationsComponent, NewcommunicComponent],
  imports: [
    CommonModule,
    CommunicationsRoutingModule,
    TranslateModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
  ]
})


export class CommunicationsModule { }

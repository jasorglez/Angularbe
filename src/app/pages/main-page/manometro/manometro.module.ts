import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManometroRoutingModule } from './manometro-routing.module';
import { ManometroComponent } from './manometro.component';

//requiero este modulo para evitar el error del translate asi realizar su declarion como en la linea 26
import { TranslateModule } from '@ngx-translate/core'

//Angular Material
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

// Forzosamente necesita este componente para activar el formulario del inicio en caso nuevo, son forzos,
//igual los otros dos si quieres usar angular material
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [ManometroComponent],
  imports: [
    CommonModule,
    TranslateModule,
    ManometroRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    MatCardModule,
    MatDialogModule
  ]
})
export class ManometroModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//requiero este modulo para evitar el error del translate asi realizar su declarion como en la linea 26
import { TranslateModule } from '@ngx-translate/core'

import { ComprovComponent } from './comprov.component';
import { NewProvComponent } from './newProv/newProv.component';
import { EditProvComponent } from './editProv/editProv.component';
import { ComprovRoutingModule } from './comprov-routing.module';

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
  declarations: [ComprovComponent, NewProvComponent, EditProvComponent],
  imports: [
    CommonModule,
    TranslateModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDialogModule,
    MatSelectModule,
    FormsModule,
    ComprovRoutingModule

  ]
})
export class ComprovModule { }

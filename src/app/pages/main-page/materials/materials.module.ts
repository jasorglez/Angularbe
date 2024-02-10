import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//requiero este modulo para evitar el error del translate asi realizar su declarion como en la linea 26
import { TranslateModule } from '@ngx-translate/core'

import { MatDialogModule } from '@angular/material/dialog';
import { MaterialsRoutingModule } from './materials-routing.module' ;
import { MaterialsComponent } from './materials.component';

//Angular Material
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';

// Forzosamente necesita este componente para activar el formulario del inicio en caso nuevo, son forzos,
//igual los otros dos si quieres usar angular material
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { NewMatComponent } from './newMat/newMat.component';


@NgModule({
  declarations: [MaterialsComponent, NewMatComponent],
  imports: [
    CommonModule,
    TranslateModule,
    MatDialogModule,
    MaterialsRoutingModule,
    MatTableModule,
    MatCardModule,
    MatPaginatorModule,
    MatSortModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule
  ]
})
export class MaterialsModule { }

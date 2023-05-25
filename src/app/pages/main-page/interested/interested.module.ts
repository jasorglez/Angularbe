import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Forzosamente necesita este componente para activar el formulario del inicio en caso nuevo, son forzos, igual los otros dos si quieres usar angular material
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';


import { InterestedComponent } from './interested.component';

import { InterestedRoutingModule } from './interested-routing.module';


//Angular Material
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs'
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';

import { TranslateModule } from '@ngx-translate/core';
import { NewInterestedComponent } from './newInterested/newInterested.component';
import { EditInterestedComponent } from './editInterested/editInterested.component';

@NgModule({
  declarations: [InterestedComponent, NewInterestedComponent, EditInterestedComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
     MatFormFieldModule,
     MatSelectModule,
     FormsModule,
    InterestedRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatTabsModule,
    MatSortModule,
    MatIconModule,
    MatCardModule,
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule, TranslateModule
  ]
})
export class InterestedModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Forzosamente necesita este componente para activar el formulario del inicio en caso nuevo
import { ReactiveFormsModule } from '@angular/forms';

import { UsersRoutingModule } from './users-routing.module';

//Angular Material
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs'
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';

import { PipesModule } from 'src/app/pipes/pipes.module';

import { TranslateModule } from '@ngx-translate/core';
import { UsersComponent } from './users.component';
import { NewComponent } from './new/new.component';
import { EditComponent } from './edit/edit.component';



@NgModule({
  declarations: [UsersComponent, NewComponent, EditComponent],
  imports: [
    CommonModule,
    UsersRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatTabsModule,
    MatSortModule,
    MatIconModule,
    MatCardModule, MatDialogModule,
    ReactiveFormsModule,
    PipesModule,
    TranslateModule

  ]
})
export class UsersModule { }

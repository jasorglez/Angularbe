import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { UsersRoutingModule } from './users-routing.module';

import { UsersComponent } from './users.component';

//Angular Material
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs'
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';

import { PipesModule } from 'src/app/pipes/pipes.module';

import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [UsersComponent],
  imports: [
    CommonModule,
    UsersRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatTabsModule,
    MatSortModule,
    MatIconModule,
    MatCardModule,
    ReactiveFormsModule,
    PipesModule,
    TranslateModule

  ]
})
export class UsersModule { }

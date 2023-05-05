import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InterestedComponent } from './interested.component';

import { InterestedRoutingModule } from './interested-routing.module';

//Angular Material
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [InterestedComponent],
  imports: [
    CommonModule,
    InterestedRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule, TranslateModule
  ]
})
export class InterestedModule { }

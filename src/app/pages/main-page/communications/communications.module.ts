import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommunicationsComponent } from './communications.component';
import { NewcommunicComponent } from './newcommunic/newcommunic.component';

import { TranslateModule } from '@ngx-translate/core';

import { CommunicationsRoutingModule } from './communications.routing';



@NgModule({
  declarations: [CommunicationsComponent, NewcommunicComponent],
  imports: [
    CommonModule,
    CommunicationsRoutingModule,
    TranslateModule
  ]
})


export class CommunicationsModule { }

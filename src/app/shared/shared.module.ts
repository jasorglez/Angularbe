import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NavBarComponent } from './nav-bar/nav-bar.component';
import { FooterComponent } from './footer/footer.component';
import { SideBarComponent } from './side-bar/side-bar.component';

//rutas
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import {MatMenuModule} from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';

import { TranslateService} from '@ngx-translate/core';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [NavBarComponent, FooterComponent, SideBarComponent],
  exports     : [NavBarComponent, FooterComponent, SideBarComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule, MatMenuModule, MatIconModule,
    TranslateModule
  ]
})
export class SharedModule { }

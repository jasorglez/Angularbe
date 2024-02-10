import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogCustomComponent } from './dialogCustom.component';

@NgModule({

  declarations: [DialogCustomComponent],
  imports  : [CommonModule, MatDialogModule],
  exports: [DialogCustomComponent],
})
export class DialogCustomModule { }

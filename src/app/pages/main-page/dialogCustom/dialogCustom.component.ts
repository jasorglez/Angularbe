import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-dialogCustom',
  templateUrl: './dialogCustom.component.html',
  styleUrls: ['./dialogCustom.component.css']
})
export class DialogCustomComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}



  ngOnInit() {
  }

}

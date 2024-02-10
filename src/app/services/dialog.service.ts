
import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { DialogCustomComponent } from '../pages/main-page/dialogCustom/dialogCustom.component';


@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(private matDialog: MatDialog) {}

  openDialogCustom() {
    const dialogRef: MatDialogRef<DialogCustomComponent> = this.matDialog.open(DialogCustomComponent, {
      width: '400px', // ajusta el ancho según tus necesidades
      data: {} // puedes pasar datos al componente de diálogo si es necesario
    });

    return dialogRef.afterClosed(); // puedes devolver el observable para realizar acciones después de que se cierre el diálogo
  }


}

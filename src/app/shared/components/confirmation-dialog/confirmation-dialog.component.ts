import { Component, Inject, Input, Optional } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css']
})
export class ConfirmationDialogComponent {
  @Input("dialogTitle") dialogTitle: string = "Make transaction";
  @Input("dialogMessage") dialogMessage: string = "Would you like to make this transation?";

  constructor(public dialogRef: MatDialogRef<ConfirmationDialogComponent>) {}

  onNoClick()
  {
    this.dialogRef.close('no');
  }

  onYesClick()
  {
    this.dialogRef.close('yes');
  }

}

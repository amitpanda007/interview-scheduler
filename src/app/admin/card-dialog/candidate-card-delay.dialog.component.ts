import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

@Component({
  selector: "delay-dialog",
  template: `
  <mat-form-field>
    <mat-label>Delay (min)</mat-label>
    <input
      required
      type="number"
      matInput
      cdkFocusInitial
      [(ngModel)]="data.delay.time"
    />
  </mat-form-field>

  <div mat-dialog-actions>
    <button mat-button [mat-dialog-close]="{ delay: data.delay }">Ok</button>
    <button mat-button (click)="cancel()">Cancel</button>
  </div>
  `,
})
export class DelayDialogComponent {
  private backupDelay: Partial<IDelay> = {...this.data.delay} ;
  
  constructor(
    public dialogRef: MatDialogRef<DelayDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DelayDialogData
  ) {}

  cancel() {
    this.data.delay.time = this.backupDelay.time;
    this.data.cancel = true;
    this.dialogRef.close(this.data);
  }
}

export interface DelayDialogData {
  delay: IDelay;
  cancel: boolean
}

export interface DelayDialogResult {
  delay: IDelay;
  cancel: boolean;
}

export interface IDelay {
  time: number;
}
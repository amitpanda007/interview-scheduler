import { Component } from "@angular/core";
import { MatDialogRef } from "@angular/material";

@Component({
  selector: "delete-dialog",
  template: `
  <div class="form-group">
    <mat-label for="file">Choose file</mat-label>
    <input
        type="file"
        id="file"
        (change)="handleFileInput($event.target.files)">
  </div>

  <div mat-dialog-actions>
    <button mat-button [mat-dialog-close]="{ content: fileToUpload }">Ok</button>
    <button mat-button (click)="cancel()">Cancel</button>
  </div>
  `,
})
export class FileUploadDialogComponent {
  fileToUpload: File;
  constructor(
    public dialogRef: MatDialogRef<FileUploadDialogComponent>
  ) {
    this.fileToUpload = null;
  }

  cancel() {
    const data = {
      content: null,
    };
    this.dialogRef.close(data);
  }

  handleFileInput(files: FileList) {
    if(files.length !== 1) throw new Error('Cannot upload multiple files.');
    this.fileToUpload = files.item(0);
  }
}

export interface FileUploadDialogResult {
  content: File
}

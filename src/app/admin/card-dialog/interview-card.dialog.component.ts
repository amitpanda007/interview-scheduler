import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { IInterview } from "../interview-card/interview";

@Component({
  selector: "interview-card-dialog",
  templateUrl: "interview-card.dialog.component.html",
  styleUrls: ["interview-card.dialog.component.scss"],
})
export class InterviewCardDialogComponent {
  private backupCandidate: Partial<IInterview> = { ...this.data.interview };

  constructor(
    public dialogRef: MatDialogRef<InterviewCardDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: InterviewCardDialogData
  ) {}

  cancel() {
    this.data.interview.name = this.backupCandidate.name;
    this.data.interview.date = this.backupCandidate.date;
    this.data.interview.startTime = this.backupCandidate.startTime;
    this.data.cancel = true;
    this.dialogRef.close(this.data);
  }
}

export interface InterviewCardDialogData {
  interview: IInterview;
  enableDelete: boolean;
  cancel: boolean;
}

export interface InterviewCardDialogResult {
  interview: IInterview;
  delete?: boolean;
  cancel?: boolean;
}

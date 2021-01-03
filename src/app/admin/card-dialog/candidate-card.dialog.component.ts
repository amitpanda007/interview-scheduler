import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { ICandidate } from "src/app/schedule/candidate";

@Component({
  selector: "candidate-card-dialog",
  templateUrl: "candidate-card.dialog.component.html",
  styleUrls: ["candidate-card.dialog.component.scss"],
})
export class CandidateCardDialogComponent {
  private backupCandidate: Partial<ICandidate> = { ...this.data.candidate };

  constructor(
    public dislogRef: MatDialogRef<CandidateCardDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CandidateCardDialogData
  ) {}

  cancel() {
    this.data.candidate.rank = this.backupCandidate.rank;
    this.data.candidate.name = this.backupCandidate.name;
    this.data.candidate.scheduledTime = this.backupCandidate.scheduledTime;
    this.data.cancel = true;
    this.dislogRef.close(this.data);
  }
}

export interface CandidateCardDialogData {
  candidate: ICandidate;
  enableDelete: boolean;
  cancel: boolean;
}

export interface CandidateCardDialogResult {
  candidate: ICandidate;
  delete?: boolean;
  cancel?: boolean;
}

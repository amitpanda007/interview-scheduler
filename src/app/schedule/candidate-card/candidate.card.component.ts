import { Component, Input, OnInit, Output } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { MatDialog } from "@angular/material";
import { EventEmitter } from "@angular/core";
import {
  CandidateCardDialogComponent,
  CandidateCardDialogResult,
} from "src/app/admin/card-dialog/candidate-card.dialog.component";
import { ICandidate } from "../candidate";

@Component({
  selector: "candidate-card",
  templateUrl: "candidate.card.component.html",
  styleUrls: ["candidate.card.component.scss"],
})
export class CandidateCardComponent implements OnInit {
  @Input() candidate: ICandidate;
  @Input() isAdminCard: boolean = false;
  @Input() isAdminLiveCard: boolean = false;
  @Output() deleteData = new EventEmitter<String>();
  @Output() editData = new EventEmitter();
  @Output() interviewDone = new EventEmitter<String>();

  constructor(private dialog: MatDialog, private store: AngularFirestore) {}

  ngOnInit(): void {}

  editCandidate(candidate: ICandidate): void {
    const candidateOld = {};
    Object.assign(candidateOld, candidate);
    console.log("Editing candidate");
    const dialogRef = this.dialog.open(CandidateCardDialogComponent, {
      width: "270px",
      data: {
        candidate,
        enableDelete: true,
      },
    });
    dialogRef.afterClosed().subscribe((result: CandidateCardDialogResult) => {
      console.log(result);
      if (result.delete) {
        console.log("Delete the candidate");
      } else {
        if (!result.cancel) {
          const data = {
            candidate: candidate,
            candidateOld: candidateOld,
          };
          this.editData.emit(data);
        }
      }
    });
  }

  deleteCandidate(candidateId: string) {
    console.log(`Deleting candidate ${candidateId}`);
    this.deleteData.emit(candidateId);
  }

  interviewComplete(candidate: ICandidate) {
    console.log(`Setting Candidate Interview Complete ${candidate.id}`);
    const userData: any = {
      id: candidate.id,
      status: candidate.done,
    };
    this.interviewDone.emit(userData);
  }
}

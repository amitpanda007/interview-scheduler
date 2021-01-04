import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { MatDialog, MatSnackBar } from "@angular/material";
import { ActivatedRoute } from "@angular/router";
import { SuccessSnackbar } from "src/app/common/snackbar.component";
import { ICandidate } from "src/app/schedule/candidate";
import {
  CandidateCardDialogComponent,
  CandidateCardDialogResult,
} from "../card-dialog/candidate-card.dialog.component";

@Component({
  selector: "admin-edit",
  templateUrl: "admin-edit.component.html",
  styleUrls: ["admin-edit.component.scss"],
})
export class AdminEditComponent implements OnInit {
  interview: any;
  candidates: any;
  constructor(
    private _route: ActivatedRoute,
    private store: AngularFirestore,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private _location: Location
  ) {}

  ngOnInit() {
    const paramData = this._route.snapshot.paramMap.get("interview");
    this.interview = JSON.parse(atob(paramData));

    console.log(this.interview);
    this.store
      .collection("interviews")
      .doc(this.interview.id)
      .collection("candidates", (ref) => ref.orderBy("rank"))
      .valueChanges({ idField: "id" })
      .subscribe((candidates) => {
        console.log(candidates);
        this.candidates = candidates;
      });
  }

  saveInterviewData(interview) {
    const interviewData = {
      name: interview.name,
      date: interview.date,
      startTime: interview.startTime,
    };
    this.store
      .collection("interviews")
      .doc(interview.id)
      .update(interviewData)
      .then((_) => {
        console.log("Data Updated Successfully.");
        this.snackBar.openFromComponent(SuccessSnackbar, {
          data: "Data Updated Successfully",
          duration: 2000,
        });
      });
  }

  backToPreviousPage() {
    this._location.back();
  }

  editCandidate(candidate: ICandidate) {
    const candidateData = {
      rank: candidate.rank,
      name: candidate.name,
      scheduledTime: candidate.scheduledTime,
    };

    this.store
      .collection("interviews")
      .doc(this.interview.id)
      .collection("candidates")
      .doc(candidate.id)
      .update(candidateData)
      .then((_) => {
        console.log("Data Updated Successfully.");
        this.snackBar.openFromComponent(SuccessSnackbar, {
          data: "Candidate Updated Successfully",
          duration: 2000,
        });
      });
  }

  deleteCandidate(candidateDocId) {
    this.store
      .collection("interviews")
      .doc(this.interview.id)
      .collection("candidates")
      .doc(candidateDocId)
      .delete()
      .then((_) => {
        console.log("Data Deleted Successfully.");
        this.snackBar.openFromComponent(SuccessSnackbar, {
          data: "Candidate Deleted Successfully",
          duration: 2000,
        });
      });
  }

  addCandidate() {
    const dialogRef = this.dialog.open(CandidateCardDialogComponent, {
      width: "270px",
      data: {
        candidate: {},
      },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe((result: CandidateCardDialogResult) => {
      console.log(result);
      if (result.delete) {
        console.log("Delete the candidate");
      } else {
        // TODO: handle create dialog close window properly
        if (result.candidate.name != undefined) {
          this.store
            .collection("interviews")
            .doc(this.interview.id)
            .collection("candidates")
            .add(result.candidate)
            .then((_) => {
              console.log("Data Added Successfully.");
              this.snackBar.openFromComponent(SuccessSnackbar, {
                data: "Candidate Added Successfully",
                duration: 2000,
              });
            });
        }
      }
    });
  }
}

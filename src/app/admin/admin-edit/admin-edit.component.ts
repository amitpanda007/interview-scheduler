import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { MatDialog, MatSnackBar } from "@angular/material";
import { ActivatedRoute, Router } from "@angular/router";
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
    private _location: Location,
    private _router: Router
  ) {}

  ngOnInit() {
    const paramData = this._route.snapshot.paramMap.get("interview");
    console.log(paramData);
    if (!paramData) {
      this._router.navigate(["/admin"]);
    }

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

  editCandidate(data: any) {
    const candidate = data.candidate;
    const candidateOld = data.candidateOld;

    if (candidate.rank != candidateOld.rank) {
      console.log(
        `Candidate Rank changed from ${candidateOld.rank} to ${candidate.rank}`
      );
      const prevRank = candidateOld.rank;
      const newRank = candidate.rank;
      if (prevRank > newRank) {
        console.log("Candidate Rank is updated to a LOWER number");
        for (let _candidate of this.candidates) {
          if (
            _candidate.rank >= newRank &&
            _candidate.rank < prevRank &&
            _candidate != candidate
          ) {
            _candidate.rank += 1;
            this.updateFirestore(_candidate.id, _candidate, false);
          }
        }
      } else {
        console.log("Candidate Rank is updated to a HIGHER number");
        for (let _candidate of this.candidates) {
          if (
            _candidate.rank <= newRank &&
            _candidate.rank > prevRank &&
            _candidate != candidate
          ) {
            _candidate.rank -= 1;
            this.updateFirestore(_candidate.id, _candidate, false);
          }
        }
      }
    }

    console.log(this.candidates);

    const candidateData = {
      rank: candidate.rank,
      name: candidate.name,
      scheduledTime: candidate.scheduledTime,
    };

    this.updateFirestore(candidate.id, candidateData, true);
  }

  updateFirestore(candidateId: string, candidateData, showSnackbar: boolean) {
    this.store
      .collection("interviews")
      .doc(this.interview.id)
      .collection("candidates")
      .doc(candidateId)
      .update(candidateData)
      .then((_) => {
        console.log("Data Updated Successfully.");
        if (showSnackbar) {
          this.snackBar.openFromComponent(SuccessSnackbar, {
            data: "Candidate Updated Successfully",
            duration: 2000,
          });
        }
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
      disableClose: true,
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

import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { MatDialog, MatSnackBar } from "@angular/material";
import { ActivatedRoute, Router } from "@angular/router";
import {
  SuccessSnackbar,
  ErrorSnackbar,
} from "src/app/common/snackbar.component";
import { ICandidate } from "src/app/schedule/candidate";
import {
  CandidateCardDialogComponent,
  CandidateCardDialogResult,
} from "../card-dialog/candidate-card.dialog.component";
import { AngularFireAuth } from "@angular/fire/auth";
import { IInterview } from '../interview-card/interview';
import { AdminService } from '../../core/services/admin.service';
import { Subscription } from 'rxjs';

@Component({
  selector: "admin-edit",
  templateUrl: "admin-edit.component.html",
  styleUrls: ["admin-edit.component.scss"],
})
export class AdminEditComponent implements OnInit {
  private interview: IInterview;
  private candidates: ICandidate[];
  private uid;
  private interviewId: string;
  private interviewSubscription: Subscription;
  private candidatesSubscription: Subscription

  constructor(
    private _route: ActivatedRoute,
    private _store: AngularFirestore,
    private _snackBar: MatSnackBar,
    private _dialog: MatDialog,
    private _location: Location,
    private _router: Router,
    private _afAuth: AngularFireAuth,
    private _adminService: AdminService
  ) {}

  ngOnInit() {
    this.uid = this._afAuth.auth.currentUser.uid;
    this.interviewId = this._route.snapshot.paramMap.get("interviewId");

    this._adminService.fetchInterview(this.uid, this.interviewId);
    this.interviewSubscription = this._adminService.interviewChanged.subscribe(interview => {
      interview.id = this.interviewId;
      this.interview = interview;
    });

    this._adminService.fetchCandidates(this.uid, this.interviewId);
    this.candidatesSubscription = this._adminService.candidateChanged.subscribe(candidates => {
      this.candidates = candidates;
    });
  }

  updateInterviewData(interview) {
    this._adminService.updateInterview(this.uid, interview)
      .then((_) => {
        console.log("Data Updated Successfully.");
        this._snackBar.openFromComponent(SuccessSnackbar, {
          data: "Data Updated Successfully",
          duration: 2000,
        });
      })
      .catch((error) => {
        this._snackBar.openFromComponent(ErrorSnackbar, {
          data: error.message,
          duration: 2000,
        });
      });
  }

  backToPreviousPage() {
    this._location.back();
  }

  // TODO: change multiple calls to single call, like a runTransaction for all the changed candidates
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
            this.updateFirestoreCandidate(_candidate.id, _candidate, false);
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
            this.updateFirestoreCandidate(_candidate.id, _candidate, false);
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

    this.updateFirestoreCandidate(candidate.id, candidateData, true);
  }

  updateFirestoreCandidate(candidateId: string, candidateData, showSnackbar: boolean) {
    this._adminService.updateCandidate(this.uid, this.interviewId, candidateId, candidateData)
      .then((_) => {
        console.log("Data Updated Successfully.");
        this._snackBar.openFromComponent(SuccessSnackbar, {
          data: "Candidate Updated Successfully",
          duration: 2000,
        });
      })
      .catch((error) => {
        this._snackBar.openFromComponent(ErrorSnackbar, {
          data: error.message,
          duration: 2000,
        });
      });
  }

  deleteCandidate(candidateDocId) {
    this._adminService.deleteCandidate(this.uid, this.interviewId, candidateDocId)
      .then((_) => {
        console.log("Data Updated Successfully.");
        this._snackBar.openFromComponent(SuccessSnackbar, {
          data: "Candidate Deleted Successfully",
          duration: 2000,
        });
      })
      .catch((error) => {
        this._snackBar.openFromComponent(ErrorSnackbar, {
          data: error.message,
          duration: 2000,
        });
      });
  }

  addCandidate() {
    const dialogRef = this._dialog.open(CandidateCardDialogComponent, {
      width: "270px",
      data: {
        candidate: {},
      },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result: CandidateCardDialogResult) => {
      console.log(result);
      if (result.cancel) {
        console.log("Cancelled the Candidate PopUp Window.");
      } else {
        this._adminService.addCandidate(this.uid, this.interviewId, result.candidate)
          .then((_) => {
            console.log("Data Updated Successfully.");
            this._snackBar.openFromComponent(SuccessSnackbar, {
              data: "Candidate Added Successfully",
              duration: 2000,
            });
          })
          .catch((error) => {
            this._snackBar.openFromComponent(ErrorSnackbar, {
              data: error.message,
              duration: 2000,
            });
          });
      }
    });
  }
}

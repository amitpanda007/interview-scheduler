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
import { IInterview } from "../interview-card/interview";
import { AdminService } from "../../core/services/admin.service";
import { Subscription } from "rxjs";
import { FileUploadDialogComponent, FileUploadDialogResult } from '../../common/file-upload.dialog.component';
import * as XLSX from 'xlsx';


@Component({
  selector: "admin-edit",
  templateUrl: "admin-edit.component.html",
  styleUrls: ["admin-edit.component.scss"],
})
export class AdminEditComponent implements OnInit {
  public interview: IInterview;
  public candidates: ICandidate[];
  public interviewDate: Date;
  public isLoading: boolean;
  private uid: string;
  private interviewId: string;
  private interviewSubscription: Subscription;
  private candidatesSubscription: Subscription;
  private excelData: [][];
  public isUnsavedData: boolean;
  public localCandidates: ICandidate[];

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
    this.isLoading = true;
    this.localCandidates = [];
    this.uid = this._afAuth.auth.currentUser.uid;
    this.interviewId = this._route.snapshot.paramMap.get("interviewId");

    this._adminService.fetchInterview(this.uid, this.interviewId);
    this.interviewSubscription = this._adminService.interviewChanged.subscribe(
      (interview) => {
        interview.id = this.interviewId;
        this.interview = interview;
        this.interviewDate = new Date (this.interview.date.seconds * 1000);
      }
    );

    this._adminService.fetchCandidates(this.uid, this.interviewId);
    this.candidatesSubscription = this._adminService.candidateChanged.subscribe(
      (candidates) => {
        this.candidates = candidates;
        this.isLoading = false;
      }
    );
  }

  updateInterviewData(interview) {
    this.isLoading = true;
    interview.date = this.interviewDate;
    this._adminService
      .updateInterview(this.uid, interview)
      .then((_) => {
        console.log("Data Updated Successfully.");
        this.isLoading = false;
        this._snackBar.openFromComponent(SuccessSnackbar, {
          data: "Data Updated Successfully",
          duration: 2000,
        });
      })
      .catch((error) => {
        this.isLoading = false;
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

  editLocalCandidate(data: any) {
    console.log(data);
  }

  updateFirestoreCandidate(
    candidateId: string,
    candidateData,
    showSnackbar: boolean
  ) {
    this._adminService
      .updateCandidate(this.uid, this.interviewId, candidateId, candidateData)
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
    this._adminService
      .deleteCandidate(this.uid, this.interviewId, candidateDocId)
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

  deleteLocalCandidate(candidateId) {
    console.log(candidateId)
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
        this._adminService
          .addCandidate(this.uid, this.interviewId, result.candidate)
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

  uploadCandidate() {
    const dialogRef = this._dialog.open(FileUploadDialogComponent, {
      width: "370px",
      data: {
        candidate: {},
      },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result: FileUploadDialogResult) => {
      const reader: FileReader = new FileReader();
      reader.readAsBinaryString(result.content);

      reader.onload = (e: any) => {
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];
        this.excelData = (XLSX.utils.sheet_to_json(ws, {header: 1}));
        this.showUploadedCandidate(this.excelData);
      }
    });
  }

  showUploadedCandidate(candidateData: Array<any>) {
    for(let i = 1; i < candidateData.length; i++) {
      let cand = {
        id: this.randomString(10, true),
        rank: candidateData[i][0],
        name: candidateData[i][1],
        scheduledTime: candidateData[i][2]
      }
      this.localCandidates.push(cand);
    }
  }

  randomString(length: number, temp: boolean, chars: string = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"): string {
    let result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    if(temp) {
      result = "TEMP-" + result; 
    }
    return result;
  }
}

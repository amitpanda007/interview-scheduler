import { Component, OnInit, OnDestroy } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { MatDialog, MatSnackBar } from "@angular/material";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable, Subscription } from 'rxjs';
import { SuccessSnackbar, ErrorSnackbar } from "../common/snackbar.component";
import {
  InterviewCardDialogComponent,
  InterviewCardDialogResult,
} from "./card-dialog/interview-card.dialog.component";
import { AngularFireAuth } from '@angular/fire/auth';
import { AdminService } from '../core/services/admin.service';
import { IInterview } from './interview-card/interview';

@Component({
  selector: "admin",
  templateUrl: "admin.component.html",
  styleUrls: ["admin.component.scss"],
})
export class AdminComponent implements OnInit, OnDestroy {
  private interviews: IInterview[];
  private interviewsSubscription: Subscription;
  private _uid: string;
  private isLoading: boolean;

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _store: AngularFirestore,
    private _dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private _afAuth: AngularFireAuth,
    private _adminService: AdminService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this._uid = this._afAuth.auth.currentUser.uid;
    this._adminService.fetchInterviews(this._uid);
    this.interviewsSubscription = this._adminService.interviewsChanged.subscribe(interviews => {
      this.interviews = interviews;
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.interviewsSubscription.unsubscribe();
  }

  createSchedule() {
    const dialogRef = this._dialog.open(InterviewCardDialogComponent, {
      width: "370px",
      data: {
        interview: {},
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result: InterviewCardDialogResult) => {
      console.log(result);
      result.interview.live = false;
      if (!result.cancel && result.interview.name != undefined) {
        this._adminService.addInterviewDoc(this._uid, result.interview)
        .then((_) => {
          this._snackBar.openFromComponent(SuccessSnackbar, {
            data: "Candidate Added Successfully",
            duration: 2000,
          })
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

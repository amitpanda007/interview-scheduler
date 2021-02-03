import { Location } from "@angular/common";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { MatSnackBar } from "@angular/material";
import { ActivatedRoute, Router } from "@angular/router";
import {
  SuccessSnackbar,
  ErrorSnackbar,
} from "src/app/common/snackbar.component";
import { ICandidate } from "src/app/schedule/candidate";
import { IInterview } from "../interview-card/interview";
import { AngularFireAuth } from "@angular/fire/auth";
import { AdminService } from "../../core/services/admin.service";
import { Subscription } from "rxjs";

@Component({
  selector: "admin-view",
  templateUrl: "admin-view.component.html",
  styleUrls: ["admin-view.component.scss"],
})
export class AdminViewComponent implements OnInit, OnDestroy {
  public interview: IInterview;
  public candidates: ICandidate[];
  public isLoading: boolean;
  private uid: string;
  private interviewId: string;
  private interviewSubscription: Subscription;
  private candidatesSubscription: Subscription;

  constructor(
    private _route: ActivatedRoute,
    private _location: Location,
    private _snackBar: MatSnackBar,
    private _afAuth: AngularFireAuth,
    private _adminService: AdminService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.uid = this._afAuth.auth.currentUser.uid;
    this.interviewId = this._route.snapshot.paramMap.get("interviewId");
    // const interviewId = JSON.parse(atob(paramData));

    this._adminService.fetchInterview(this.uid, this.interviewId);
    this.interviewSubscription = this._adminService.interviewChanged.subscribe(
      (interview) => {
        interview.id = this.interviewId;
        this.interview = interview;
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

  ngOnDestroy() {
    this.interviewSubscription.unsubscribe();
    this.candidatesSubscription.unsubscribe();
  }

  backToPreviousPage() {
    this._location.back();
  }

  updateCandidateStatus(userInfo) {
    const candidateId: string = userInfo.id;
    const status: boolean = userInfo.status;

    this._adminService
      .setCandidateCompleteStatus(
        this.uid,
        this.interviewId,
        candidateId,
        status
      )
      .then((_) => {
        this._snackBar.openFromComponent(SuccessSnackbar, {
          data: `Updated Candidate Interview Status To: ${status}`,
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

  liveInterview(data) {
    this._adminService.setInterviewLiveStatus(this.uid, data.id, data.isLive);
  }

  addDelayToCandidate(delayData) {
    this._adminService.setCandidateDelay(
      this.uid,
      this.interviewId,
      delayData.candidateId,
      delayData.delay
    );
  }

  privacyMode(data) {
    this._adminService.setInterviewPrivacyStatus(
      this.uid,
      data.id,
      data.isPrivateMode
    );
  }

  chatMode(data) {
    this._adminService.setInterviewChatStatus(this.uid, data.id, data.isChatOn);
  }
}

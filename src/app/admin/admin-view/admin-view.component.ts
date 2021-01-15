import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { MatSnackBar } from "@angular/material";
import { ActivatedRoute, Router } from "@angular/router";
import { SuccessSnackbar, ErrorSnackbar } from "src/app/common/snackbar.component";
import { ICandidate } from "src/app/schedule/candidate";
import { IInterview } from "../interview-card/interview";
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: "admin-view",
  templateUrl: "admin-view.component.html",
  styleUrls: ["admin-view.component.scss"],
})
export class AdminViewComponent implements OnInit {
  interview: IInterview;
  candidates: any;
  private uid;
  constructor(
    private _route: ActivatedRoute,
    private _store: AngularFirestore,
    private _location: Location,
    private _snackBar: MatSnackBar,
    private _router: Router,
    private afAuth: AngularFireAuth
  ) {}

  ngOnInit() {
    this.uid = this.afAuth.auth.currentUser.uid;
    const paramData = this._route.snapshot.paramMap.get("interview");
    if (!paramData) {
      this._router.navigate(["/admin"]);
    }
    this.interview = JSON.parse(atob(paramData));

    console.log(this.interview);
    this._store
      .collection(this.uid)
      .doc(this.interview.id)
      .collection("candidates", (ref) => ref.orderBy("rank"))
      .valueChanges({ idField: "id" })
      .subscribe((candidates) => {
        console.log(candidates);
        this.candidates = candidates;
      });
  }

  backToPreviousPage() {
    this._location.back();
  }

  updateInterviewStatus(userInfo) {
    const candidateId = userInfo.id;
    const status = userInfo.status;
    console.log(`Updating Candidate Status to:${status}`);
    console.log(`Updating Interview Complete Status:${candidateId}`);

    this._store.firestore.runTransaction(() => {
      return Promise.all([
        this._store.collection(this.uid).doc(this.interview.id).collection("candidates").doc(candidateId).set({ done: status }, { merge: true }),
        this._store.collection("interviews").doc(this.interview.id).collection("candidates").doc(candidateId).set({ done: status }, { merge: true })
      ]);
    })
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
    })
  }
}

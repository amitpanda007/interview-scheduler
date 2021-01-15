import { Component, OnInit } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { MatDialog, MatSnackBar } from "@angular/material";
import { ActivatedRoute, Router } from "@angular/router";
import { SuccessSnackbar, ErrorSnackbar } from "../common/snackbar.component";
import {
  InterviewCardDialogComponent,
  InterviewCardDialogResult,
} from "./card-dialog/interview-card.dialog.component";
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: "admin",
  templateUrl: "admin.component.html",
  styleUrls: ["admin.component.scss"],
})
export class AdminComponent implements OnInit {
  interviews: any;
  private uid: any;

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private store: AngularFirestore,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private afAuth: AngularFireAuth
  ) {}

  ngOnInit() {
    this.uid = this.afAuth.auth.currentUser.uid;
    this.interviews = this.store
      .collection(this.uid, (ref) => ref.orderBy("date"))
      .valueChanges({ idField: "id" });
  }

  createSchedule() {
    // console.log("Navigating to Create Schedule Screen.");
    // this._router.navigate(["create"], { relativeTo: this._route });
    const dialogRef = this.dialog.open(InterviewCardDialogComponent, {
      width: "370px",
      data: {
        interview: {},
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result: InterviewCardDialogResult) => {
      console.log(result);
      if (!result.cancel && result.interview.name != undefined) {
        this.store.firestore.runTransaction(async () => {
          const docInfo = await this.store.collection(this.uid).add(result.interview);
          await this.store.collection("interviews").doc(docInfo.id).set(result.interview);
        })
        .then((_) => {
          this.snackBar.openFromComponent(SuccessSnackbar, {
            data: "Candidate Added Successfully",
            duration: 2000,
          })
        })
        .catch((error) => {
          this.snackBar.openFromComponent(ErrorSnackbar, {
            data: error.message,
            duration: 2000,
          });
        });
      }
    });
  }
}

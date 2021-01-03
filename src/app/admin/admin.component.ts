import { Component, OnInit } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { MatDialog, MatSnackBar } from "@angular/material";
import { ActivatedRoute, Router } from "@angular/router";
import { SuccessSnackbar } from "../common/snackbar.component";
import {
  InterviewCardDialogComponent,
  InterviewCardDialogResult,
} from "./card-dialog/interview-card.dialog.component";

@Component({
  selector: "admin",
  templateUrl: "admin.component.html",
  styleUrls: ["admin.component.scss"],
})
export class AdminComponent implements OnInit {
  interviews: any;

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private store: AngularFirestore,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.interviews = this.store
      .collection("interviews", (ref) => ref.orderBy("date"))
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
    });

    dialogRef.afterClosed().subscribe((result: InterviewCardDialogResult) => {
      if (!result.cancel) {
        this.store
          .collection("interviews")
          .add(result.interview)
          .then((_) => {
            this.snackBar.openFromComponent(SuccessSnackbar, {
              data: "Candidate Added Successfully",
              duration: 2000,
            });
          });
      }
    });
  }
}

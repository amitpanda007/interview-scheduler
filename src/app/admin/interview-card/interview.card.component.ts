import { Component, Input, OnInit } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { MatDialog, MatSnackBar } from "@angular/material";
import { ActivatedRoute, Router } from "@angular/router";
import { DeleteConfirmationDialogComponent } from "src/app/common/delete.dialog.component";
import { SuccessSnackbar } from "src/app/common/snackbar.component";

@Component({
  selector: "interview-card",
  templateUrl: "interview.card.component.html",
  styleUrls: ["interview.card.component.scss"],
})
export class InterviewCardComponent implements OnInit {
  @Input() interview;
  @Input() viewOnlyMode: boolean = false;
  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _store: AngularFirestore,
    private _snackBar: MatSnackBar,
    private _dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  viewInterview(interview) {
    console.log(`Live View of Interview: ${interview.id}`);
    this._router.navigate(
      ["view", { interview: btoa(JSON.stringify(interview)) }],
      {
        relativeTo: this._route,
      }
    );
  }

  editInterview(interview) {
    console.log(`Editing Interview: ${interview.id}`);
    this._router.navigate(
      ["edit", { interview: btoa(JSON.stringify(interview)) }],
      {
        relativeTo: this._route,
      }
    );
  }

  deleteInterview(interviewId) {
    console.log(`Deleting Interview: ${interviewId}`);
    const dialogRef = this._dialog.open(DeleteConfirmationDialogComponent, {
      width: "270px",
      disableClose: true,
    });

    dialogRef
      .afterClosed()
      .subscribe((result: DeleteConfirmationDialogComponent) => {
        if (result.cancel) {
          this._store
            .collection("interviews")
            .doc(interviewId)
            .delete()
            .then((_) => {
              console.log("Interview schedule deleted");
              this._snackBar.openFromComponent(SuccessSnackbar, {
                data: "Interview schedule deleted",
                duration: 2000,
              });
            });
        }
      });
  }
}

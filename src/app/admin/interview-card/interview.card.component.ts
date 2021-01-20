import {
  Component,
  Input,
  OnInit,
  SimpleChanges,
  Output,
  EventEmitter,
} from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { MatDialog, MatSnackBar } from "@angular/material";
import { ActivatedRoute, Router } from "@angular/router";
import {
  DeleteConfirmationDialogComponent,
  DeleteConfirmationDialogResult,
} from "src/app/common/delete.dialog.component";
import {
  SuccessSnackbar,
  ErrorSnackbar,
} from "src/app/common/snackbar.component";
import { AngularFireAuth } from "@angular/fire/auth";

@Component({
  selector: "interview-card",
  templateUrl: "interview.card.component.html",
  styleUrls: ["interview.card.component.scss"],
})
export class InterviewCardComponent implements OnInit {
  @Input() interview;
  @Input() viewOnlyMode: boolean = false;
  @Output() goingLive = new EventEmitter();
  private uid;
  public isLive: boolean;
  public color: string;
  public disabled: boolean;

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _store: AngularFirestore,
    private _snackBar: MatSnackBar,
    private _dialog: MatDialog,
    private afAuth: AngularFireAuth
  ) {}

  ngOnInit(): void {
    this.uid = this.afAuth.auth.currentUser.uid;
    this.isLive = false;
    this.color = "primary";
    this.disabled = false;
  }

  ngOnChanges(changes: SimpleChanges) {
    // only run when property "data" changed
    if (changes["interview"]) {
      if (this.interview) {
        this.interview.live ? (this.isLive = true) : (this.isLive = false);
      }
    }
  }

  viewInterview(interview) {
    console.log(`Live View of Interview: ${interview.id}`);
    this._router.navigate([`view/${interview.id}`], { relativeTo: this._route });
    
    // this._router.navigate(
    //   ["view", { interviewId: btoa(JSON.stringify(interview.id)) }],
    //   {
    //     relativeTo: this._route,
    //   }
    // );
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
      .subscribe((result: DeleteConfirmationDialogResult) => {
        console.log(result);
        if (result.delete) {
          this._store.firestore
            .runTransaction(() => {
              return Promise.all([
                this._store.collection("interviews").doc(interviewId).delete(),
                this._store.collection(this.uid).doc(interviewId).delete(),
              ]);
            })
            .then((_) => {
              this._snackBar.openFromComponent(SuccessSnackbar, {
                data: "Interview schedule deleted",
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

  goLive(interviewId: string, liveStatus: boolean) {
    const data = {
      id: interviewId,
      isLive: !liveStatus,
    };
    this.goingLive.emit(data);
  }
}

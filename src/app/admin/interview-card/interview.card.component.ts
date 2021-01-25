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
import { AdminService } from "../../core/services/admin.service";
import { IInterview } from "./interview";

@Component({
  selector: "interview-card",
  templateUrl: "interview.card.component.html",
  styleUrls: ["interview.card.component.scss"],
})
export class InterviewCardComponent implements OnInit {
  @Input() interview: IInterview;
  @Input() viewOnlyMode: boolean = false;
  @Output() goingLive = new EventEmitter();
  @Output() privacyMode = new EventEmitter();
  @Output() chatMode = new EventEmitter();
  private _uid;
  public isLive: boolean;
  public color: string;
  public disabled: boolean;

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private _dialog: MatDialog,
    private _afAuth: AngularFireAuth,
    private _adminService: AdminService
  ) {}

  ngOnInit(): void {
    this._uid = this._afAuth.auth.currentUser.uid;
    this.isLive = false;
    this.color = "primary";
    this.disabled = false;
  }

  viewInterview(interview) {
    console.log(`Live View of Interview: ${interview.id}`);
    this._router.navigate([`view/${interview.id}`], {
      relativeTo: this._route,
    });
  }

  editInterview(interview) {
    console.log(`Editing Interview: ${interview.id}`);
    this._router.navigate([`edit/${interview.id}`], {
      relativeTo: this._route,
    });
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
          this._adminService
            .deleteInterview(this._uid, interviewId)
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

  //TODO: change below toggle methods to be one method
  toggleLiveMode(interviewId: string, liveStatus: boolean) {
    const data = {
      id: interviewId,
      isLive: !this.interview.live,
    };
    this.goingLive.emit(data);
  }

  togglePrivacy(interviewId: string, privacyStatus: boolean) {
    const data = {
      id: interviewId,
      isPrivateMode: !this.interview.privacy,
    };
    this.privacyMode.emit(data);
  }

  toggleChat(interviewId: string, chatStatus: boolean) {
    const data = {
      id: interviewId,
      isChatOn: !this.interview.chat,
    };
    this.chatMode.emit(data);
  }
}

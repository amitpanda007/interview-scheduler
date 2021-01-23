import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { MatDialog } from "@angular/material";
import {
  CandidateCardDialogComponent,
  CandidateCardDialogResult,
} from "src/app/admin/card-dialog/candidate-card.dialog.component";
import { ICandidate } from "../candidate";
import {
  DeleteConfirmationDialogComponent,
  DeleteConfirmationDialogResult,
} from "src/app/common/delete.dialog.component";
import {
  DelayDialogComponent,
  DelayDialogResult,
} from "../../admin/card-dialog/candidate-card-delay.dialog.component";

@Component({
  selector: "candidate-card",
  templateUrl: "candidate.card.component.html",
  styleUrls: ["candidate.card.component.scss"],
})
export class CandidateCardComponent implements OnInit {
  @Input() candidate: ICandidate;
  @Input() isAdminCard: boolean = false;
  @Input() isAdminLiveCard: boolean = false;
  @Output() deleteData = new EventEmitter<String>();
  @Output() editData = new EventEmitter();
  @Output() interviewDone = new EventEmitter<String>();
  @Output() delayChanged = new EventEmitter();
  public delayIcon: string;
  public delayToolTip: string;

  constructor(private dialog: MatDialog, private store: AngularFirestore) {}

  ngOnInit(): void {
    this.candidate.delay > 0
      ? (this.delayIcon = "arrow_drop_up")
      : (this.delayIcon = "arrow_drop_down");
    this.candidate.delay > 0
      ? (this.delayToolTip = `delayed by ${this.candidate.delay} min`)
      : (this.delayToolTip = `completing early by ${this.candidate.delay} min`);
  }

  // TODO: Update below method not to create copy of the candidate object and updat eteh current candidate
  editCandidate(candidate: ICandidate): void {
    const candidateOld = {};
    Object.assign(candidateOld, candidate);
    console.log("Editing candidate");
    const dialogRef = this.dialog.open(CandidateCardDialogComponent, {
      width: "270px",
      data: {
        candidate,
      },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result: CandidateCardDialogResult) => {
      console.log(result);
      if (result.cancel) {
        console.log("Cancelling Candidate Pop Up window.");
      } else {
        const data = {
          candidate: candidate,
          candidateOld: candidateOld,
        };
        this.editData.emit(data);
      }
    });
  }

  deleteCandidate(candidateId: string) {
    console.log(`Deleting candidate ${candidateId}`);
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      width: "270px",
      disableClose: true,
    });
    dialogRef
      .afterClosed()
      .subscribe((result: DeleteConfirmationDialogResult) => {
        if (result.delete) {
          this.deleteData.emit(candidateId);
        }
      });
  }

  interviewComplete(candidate: ICandidate) {
    console.log(`Setting Candidate Interview Complete ${candidate.id}`);
    const userData: any = {
      id: candidate.id,
      status: candidate.done,
    };
    this.interviewDone.emit(userData);
  }

  addDelay(candidateId: string) {
    const dialogRef = this.dialog.open(DelayDialogComponent, {
      width: "270px",
      data: {
        delay: {
          time: this.candidate.delay ? this.candidate.delay : 0,
        },
      },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result: DelayDialogResult) => {
      if (result.cancel) {
        console.log("Delay Dialog PopUp Cancelled.");
      } else {
        const delayData = {
          candidateId: candidateId,
          delay: result.delay.time,
        };
        this.delayChanged.emit(delayData);
      }
    });
  }
}

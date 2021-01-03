import { Component, Input, OnInit } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { MatSnackBar } from "@angular/material";
import { ActivatedRoute, Router } from "@angular/router";
import { SuccessSnackbar } from "src/app/common/snackbar.component";

@Component({
  selector: "interview-card",
  templateUrl: "interview.card.component.html",
  styleUrls: ["interview.card.component.scss"],
})
export class InterviewCardComponent implements OnInit {
  @Input() interview;
  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private store: AngularFirestore,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  viewInterview() {
    console.log(`Live View of Interview: ${this.interview.id}`);
  }

  editInterview() {
    console.log(`Editing Interview: ${this.interview.id}`);
    this._router.navigate(
      ["edit", { interview: btoa(JSON.stringify(this.interview)) }],
      {
        relativeTo: this._route,
      }
    );
  }

  deleteInterview() {
    console.log(`Deleting Interview: ${this.interview.id}`);
    this.store
      .collection("interviews")
      .doc(this.interview.id)
      .delete()
      .then((_) => {
        console.log("Interview schedule deleted");
        this.snackBar.openFromComponent(SuccessSnackbar, {
          data: "Interview schedule deleted",
          duration: 2000,
        });
      });
  }
}

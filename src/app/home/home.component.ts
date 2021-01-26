import { Component, Input, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material";
import { ErrorSnackbar } from "../common/snackbar.component";
import { HomeService } from "../core/services/home.service";

@Component({
  selector: "home",
  templateUrl: "home.component.html",
  styleUrls: ["home.component.scss"],
})
export class HomeComponent implements OnInit {
  public interviewId: string;
  public candidateId: string;
  public readonlyMode: boolean;
  public privateMode: boolean;

  constructor(
    private homeService: HomeService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.privateMode = false;
    this.readonlyMode = false;
  }

  findInterview() {
    const id = this.interviewId.trim();
    if (id.length > 0) {
      const data = this.homeService.getInterviewFromFirebase(this.interviewId);
      data.subscribe((snapshot) => {
        const data = snapshot.data();
        console.log(data);
        if (!data) {
          console.log(`Interview with ID: ${id} , does not exist`);
          this._snackBar.openFromComponent(ErrorSnackbar, {
            data: `Interview with ID: ${id} , does not exist`,
            duration: 2000,
          });
        } else {
          if (data.privacy) {
            this.privateMode = true;
            this.readonlyMode = true;
            return;
          }
          this.homeService.navigateToInterview(id);
        }
      });
    }
  }

  findCandidate() {
    const id = this.candidateId.trim();
    if (id.length > 0) {
      const data = this.homeService.getCandidateFromFirebase(
        this.interviewId,
        id
      );
      data.subscribe((snapshot) => {
        const data = snapshot.data();
        console.log(data);
        if (!data) {
          console.log(
            `Candidate: ${id} ,is not part of Interview: ${this.interviewId}`
          );
          this._snackBar.openFromComponent(ErrorSnackbar, {
            data: `Candidate: ${id} ,is not part of interview ${this.interviewId}`,
            duration: 2000,
          });
        } else {
          this.homeService.navigateToInterviewWithCandidate(
            this.interviewId,
            id
          );
        }
      });
    }
  }
}

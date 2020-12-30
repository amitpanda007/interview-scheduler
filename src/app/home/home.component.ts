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
  private interviewId: string;

  constructor(
    private homeService: HomeService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  findInterview(event) {
    const id = this.interviewId.trim();
    if (id.length > 0) {
      const data = this.homeService.getInterviewFromFirebase(this.interviewId);
      data.subscribe((snapshot) => {
        const data = snapshot.data();
        if (!data) {
          console.log(`Interview with ID: ${id} , does not exist`);
          this._snackBar.openFromComponent(ErrorSnackbar, {
            data: `Interview with ID: ${id} , does not exist`,
            duration: 2000,
          });
        } else {
          this.homeService.navigateToInterview(id);
        }
      });
    }
  }
}

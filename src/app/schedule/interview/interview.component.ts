import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "interview",
  templateUrl: "interview.component.html",
  styleUrls: ["interview.component.scss"],
})
export class InterviewComponent implements OnInit {
  private interviewRouteId: string;
  constructor(private route: ActivatedRoute) {}
  ngOnInit(): void {
    this.interviewRouteId = this.route.snapshot.paramMap.get("interviewId");
    console.log(this.interviewRouteId);
  }
}

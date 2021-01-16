import { Component, OnInit } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "interview",
  templateUrl: "interview.component.html",
  styleUrls: ["interview.component.scss"],
})
export class InterviewComponent implements OnInit {
  public interviewRouteId: string;
  public interviewName: string;
  public interviewDate: string;
  public interviewStartTime: string;
  public currentlyLive: boolean;

  constructor(private route: ActivatedRoute, private store: AngularFirestore) {}

  ngOnInit(): void {
    this.interviewRouteId = this.route.snapshot.paramMap.get("interviewId");
    const docValue = this.store
      .collection("interviews")
      .doc(this.interviewRouteId)
      .valueChanges();

    docValue.subscribe((snapshot: any) => {
      this.interviewName = snapshot.name;
      this.interviewDate = snapshot.date;
      this.interviewStartTime = snapshot.startTime;
      this.currentlyLive = snapshot.live;
    });
  }
}

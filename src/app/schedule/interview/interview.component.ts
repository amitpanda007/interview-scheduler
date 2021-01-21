import { Component, OnInit, OnDestroy } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from 'rxjs';
import { ScheduleService } from '../../core/services/schedule.service';
import { IInterview } from '../../admin/interview-card/interview';

@Component({
  selector: "interview",
  templateUrl: "interview.component.html",
  styleUrls: ["interview.component.scss"],
})
export class InterviewComponent implements OnInit, OnDestroy {
  public interviewId: string;
  private interview: IInterview;
  private interviewsSubscription: Subscription;

  constructor(private route: ActivatedRoute, private scheduleService: ScheduleService) {}

  ngOnInit(): void {
    this.interviewId = this.route.snapshot.paramMap.get("interviewId");
    this.scheduleService.fetchIntervewWithId(this.interviewId);
    this.interviewsSubscription = this.scheduleService.interviewChanged.subscribe(interview => {
      this.interview = interview;
    });
  }

  ngOnDestroy(): void {
    this.interviewsSubscription.unsubscribe();
  }
}

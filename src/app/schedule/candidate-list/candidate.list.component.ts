import { Component, Input, OnInit, OnDestroy } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { ICandidate } from "../candidate";
import { Subscription } from 'rxjs';
import { ScheduleService } from '../../core/services/schedule.service';

@Component({
  selector: "candidate-list",
  templateUrl: "candidate.list.component.html",
  styleUrls: ["candidate.list.component.scss"],
})
export class CandidateListComponent implements OnInit, OnDestroy {
  @Input() interviewId: string;
  private candidates: ICandidate[];
  public filteredCandidates: ICandidate[];
  private candidateSubscription: Subscription;

  constructor(private _scheduleService: ScheduleService) {}

  ngOnInit(): void {
    this._scheduleService.fetchCandidatesOfInterview(this.interviewId);
    this.candidateSubscription = this._scheduleService.candidateChanged.subscribe(candidates => {
      if (!candidates[0].done) {
        candidates[0].active = true;
      }

      for (let i = 0; i < candidates.length - 1; i++) {
        if (candidates[i].done && !candidates[i + 1].done) {
          candidates[i + 1].active = true;
        }
      }
      
      this.candidates = this.filteredCandidates = candidates;
    });
  }

  ngOnDestroy() {
    this.candidateSubscription.unsubscribe();
  }

  filterCandidates(data) {
    if (data) {
      this.filteredCandidates = this.candidates.filter((candidateList: any) => {
        return (
          candidateList.name.toLowerCase().indexOf(data.toLowerCase()) > -1
        );
      });
    } else {
      this.filteredCandidates = this.candidates;
    }
  }
}

import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CandidateCardComponent } from "./candidate-card/candidate.card.component";
import { CandidateListComponent } from "./candidate-list/candidate.list.component";
import { FilterCandidatesComponent } from "./candidate-list/filter.candidates.component";
import { InterviewComponent } from "./interview/interview.component";

const routes: Routes = [
  {
    path: "interview/:interviewId",
    component: InterviewComponent,
  },
  {
    path: "interview/:interviewId/:candidateId",
    component: InterviewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScheduleRoutingModule {
  static components = [
    CandidateCardComponent,
    CandidateListComponent,
    FilterCandidatesComponent,
    InterviewComponent,
  ];
}

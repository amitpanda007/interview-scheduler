import { NgModule } from "@angular/core";
import { SharedModule } from "../shared/shared.module";
import { CandidateCardComponent } from "./candidate-card/candidate.card.component";
import { ScheduleRoutingModule } from "./schedule.routing.module";

@NgModule({
  imports: [SharedModule, ScheduleRoutingModule],
  declarations: [ScheduleRoutingModule.components],
  exports: [CandidateCardComponent],
})
export class ScheduleModule {}

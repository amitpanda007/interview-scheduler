import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { ScheduleModule } from "../schedule/schedule.module";
import { SharedModule } from "../shared/shared.module";
import { AdminRoutingModule } from "./admin.routing.module";
import { CandidateCardDialogComponent } from "./card-dialog/candidate-card.dialog.component";
import { InterviewCardDialogComponent } from "./card-dialog/interview-card.dialog.component";

@NgModule({
  imports: [
    SharedModule,
    ScheduleModule,
    AdminRoutingModule,
  ],
  declarations: [AdminRoutingModule.components],
  exports: [CandidateCardDialogComponent, InterviewCardDialogComponent],
})
export class AdminModule {}

import { NgModule } from "@angular/core";
import { SharedModule } from "../shared/shared.module";
import { ScheduleRoutingModule } from "./schedule.routing.module";

@NgModule({
  imports: [SharedModule, ScheduleRoutingModule],
  declarations: [ScheduleRoutingModule.components],
})
export class ScheduleModule {}

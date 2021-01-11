import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { ScheduleModule } from "../schedule/schedule.module";
import { SharedModule } from "../shared/shared.module";
import { AuthRoutingModule } from './auth.routing.module';

@NgModule({
  imports: [
    ReactiveFormsModule,
    SharedModule,
    AuthRoutingModule
  ],
  declarations: [AuthRoutingModule.components],
  exports: [],
})
export class AuthModule {}

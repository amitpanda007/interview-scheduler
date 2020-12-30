import { NgModule } from "@angular/core";
import { LoginRoutingModule } from "./login-route.module";
import { ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "../shared/shared.module";

@NgModule({
  imports: [ReactiveFormsModule, SharedModule, LoginRoutingModule],
  declarations: [LoginRoutingModule.components],
})
export class LoginModule {}

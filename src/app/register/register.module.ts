import { NgModule } from "@angular/core";
import { RegisterRoutingModule } from './register-route.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  imports: [ReactiveFormsModule, SharedModule, RegisterRoutingModule],
  declarations: [RegisterRoutingModule.components]
})
export class RegisterModule{

}

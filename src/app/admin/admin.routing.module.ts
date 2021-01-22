import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AdminEditComponent } from "./admin-edit/admin-edit.component";
import { AdminViewComponent } from "./admin-view/admin-view.component";
import { AdminComponent } from "./admin.component";
import { CandidateCardDialogComponent } from "./card-dialog/candidate-card.dialog.component";
import { InterviewCardDialogComponent } from "./card-dialog/interview-card.dialog.component";
import { InterviewCardComponent } from "./interview-card/interview.card.component";
import { AngularFireAuthGuard, customClaims } from "@angular/fire/auth-guard";
import { pipe } from "rxjs";
import { map } from "rxjs/operators";
import { DelayDialogComponent } from './card-dialog/candidate-card-delay.dialog.component';

const adminOnly = () =>
  pipe(
    customClaims,
    map((claims) => claims.admin === true || [""])
  );

const routes: Routes = [
  {
    path: "admin",
    component: AdminComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: adminOnly },
  },
  {
    path: "admin/view/:interviewId",
    component: AdminViewComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: adminOnly },
  },
  {
    path: "admin/edit/:interviewId",
    component: AdminEditComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: adminOnly },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {
  static components = [
    AdminComponent,
    AdminEditComponent,
    AdminViewComponent,
    InterviewCardComponent,
    CandidateCardDialogComponent,
    InterviewCardDialogComponent,
    DelayDialogComponent
  ];
}

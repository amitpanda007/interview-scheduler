import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AdminCreateComponent } from "./admin-create/admin-create.component";
import { AdminEditComponent } from "./admin-edit/admin-edit.component";
import { AdminViewComponent } from "./admin-view/admin-view.component";
import { AdminComponent } from "./admin.component";
import { CandidateCardDialogComponent } from "./card-dialog/candidate-card.dialog.component";
import { InterviewCardDialogComponent } from "./card-dialog/interview-card.dialog.component";
import { InterviewCardComponent } from "./interview-card/interview.card.component";

const routes: Routes = [
  {
    path: "admin",
    component: AdminComponent,
  },
  {
    path: "admin/create",
    component: AdminCreateComponent,
  },
  {
    path: "admin/view",
    component: AdminViewComponent,
  },
  {
    path: "admin/edit",
    component: AdminEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {
  static components = [
    AdminComponent,
    AdminCreateComponent,
    AdminEditComponent,
    AdminViewComponent,
    InterviewCardComponent,
    CandidateCardDialogComponent,
    InterviewCardDialogComponent,
  ];
}

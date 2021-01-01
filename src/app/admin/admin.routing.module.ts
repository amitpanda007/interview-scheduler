import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AdminCreateComponent } from "./admin-create/admin-create.component";
import { AdminEditComponent } from "./admin-edit/admin-edit.component";
import { AdminComponent } from "./admin.component";

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
    path: "admin/edit/:interviewId",
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
  ];
}

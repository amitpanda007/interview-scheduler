import { NgModule, SkipSelf, Optional } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../shared/shared.module";

import { AuthService } from "./services/auth.service";
import { CacheService } from "./services/cache.service";
import { LocalStorageService } from "./services/local.storage.service";
import { EnsureModuleLoadedOnceGuard } from "./services/ensure-module-loaded-once.guard";
import { NavComponent } from "./nav/nav.component";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { AuthInterceptor } from "./interceptors/auth.interceptor";
import { MatSnackBarModule } from "@angular/material";
import { NavService } from "./services/nav.service";
import { HomeService } from "./services/home.service";
import { AdminService } from './services/admin.service';
import { ScheduleService } from './services/schedule.service';

@NgModule({
  imports: [CommonModule, SharedModule],
  exports: [NavComponent],
  declarations: [NavComponent],
  providers: [
    AuthService,
    CacheService,
    LocalStorageService,
    MatSnackBarModule,
    NavService,
    HomeService,
    AdminService,
    ScheduleService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
})
export class CoreModule extends EnsureModuleLoadedOnceGuard {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    super(parentModule);
  }
}

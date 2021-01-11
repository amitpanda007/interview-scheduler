import { Component, OnInit } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";
import { NavService } from "../services/nav.service";
import { AngularFireAuth } from "@angular/fire/auth";

@Component({
  moduleId: module.id,
  selector: "nav",
  templateUrl: "nav.component.html",
  styleUrls: ["nav.component.scss"],
})
export class NavComponent implements OnInit {
  baseClass: string;
  authenticated: boolean;
  fullName: string;

  constructor(
    private auth: AuthService,
    private router: Router,
    private navService: NavService,
    private afAuth: AngularFireAuth
  ) {}

  ngOnInit(): void {
    this.baseClass = "toolbar";

    this.navService.newClass$.subscribe((className) => {
      console.log(className);
      this.baseClass = className;
    });
  }

  openLogin() {
    this.router.navigate(["/login"]);
  }

  openRegister() {
    this.router.navigate(["/register"]);
  }

  openInterviews() {
    this.router.navigate(["/interviews"]);
  }
}

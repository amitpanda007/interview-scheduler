import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";

import {
  SuccessSnackbar,
  ErrorSnackbar,
} from "../../common/snackbar.component";
import { AngularFireAuth } from "@angular/fire/auth";

@Injectable()
export class AuthService {
  constructor(
    private router: Router,
    private _snackBar: MatSnackBar,
    private afAuth: AngularFireAuth
  ) {}

  async register(user) {
    const { fullName, email, password } = user;

    try {
      const resp = await this.afAuth.auth.createUserWithEmailAndPassword(
        email,
        password
      );
      await resp.user.updateProfile({ displayName: fullName });

      this.router.navigate([""]);
      this._snackBar.openFromComponent(SuccessSnackbar, {
        data: "User Created Successfully",
        duration: 2000,
      });
    } catch (error) {
      this._snackBar.openFromComponent(ErrorSnackbar, {
        data: "Something went wrong.",
        duration: 2000,
      });
    }
  }

  async login(user) {
    const { email, password } = user;

    try {
      const resp = await this.afAuth.auth.signInWithEmailAndPassword(
        email,
        password
      );
      this.router.navigate([""]);
      this._snackBar.openFromComponent(SuccessSnackbar, {
        data: "Login Successful",
        duration: 2000,
      });
    } catch (error) {
      this._snackBar.openFromComponent(ErrorSnackbar, {
        data: error.message,
        duration: 2000,
      });
    }
  }

  logout() {
    this.afAuth.auth.signOut();
    this.router.navigate(["/login"]);
  }

  isLoggedIn() {
    return !!this.afAuth.auth.currentUser;
  }
}

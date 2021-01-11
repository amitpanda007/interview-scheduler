import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { JwtHelperService  } from "@auth0/angular-jwt";

import { SuccessSnackbar, ErrorSnackbar } from '../../common/snackbar.component';
import { environment } from '../../../environments/environment';
import { LocalStorageService } from './local.storage.service';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable()
export class AuthService{
  
  constructor(private http: HttpClient, 
    private router: Router, 
    private _snackBar: MatSnackBar, 
    private localStorageService: LocalStorageService,
    private afAuth: AngularFireAuth) {}

  async register(user) {
    const {fullName, email, password} = user

    try {
      const resp = await this.afAuth.auth.createUserWithEmailAndPassword(email, password);
      await resp.user.updateProfile({ displayName: fullName});

      this.router.navigate(['/login']);
      this._snackBar.openFromComponent(SuccessSnackbar, {
        data: "User Created Successfully",
        duration: 2000
      });
    } catch (error){
      this._snackBar.openFromComponent(ErrorSnackbar, {
        data: "Something went wrong.",
        duration: 2000
      });
    }
  }

  login(user) {
    
  }

  logout() {
    
  }

}

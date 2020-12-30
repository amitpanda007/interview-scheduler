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

const BASE_URL = environment.apiUrl;
const REGISTER_API = BASE_URL + 'auth/register';
const LOGIN_API    = BASE_URL + 'auth/login';
const LOGOUT_API   = BASE_URL + 'auth/logout';
const REFRESH_API  = BASE_URL + 'auth/refresh';
const ACC_TOKEN_KEY = "accessToken";
const REF_TOKEN_KEY = "refreshToken";
const FULLNAME_KEY  = "fullName";

class LoginResponse {
  accessToken: string;
  refreshToken: string;
  fullName: string;
}

class RefreshResponse {
  accessToken: string;
}


@Injectable()
export class AuthService{
  private jwt: JwtHelperService = new JwtHelperService();
  private authStatus: BehaviorSubject<boolean> = new BehaviorSubject(this.isAuthenticated());

  constructor(private http: HttpClient, private router: Router, private _snackBar: MatSnackBar, private localStorageService: LocalStorageService) {}

  // subscribe to get authentication status updates
  subscribe(next: (status: boolean) => void) {
    this.authStatus.subscribe(next);
  }

  get name() {
    return this.localStorageService.get(FULLNAME_KEY);
  }

  get tokenHeader() {
    const options = {
      headers: new HttpHeaders().append("Authorization", "Bearer " + this.localStorageService.get(ACC_TOKEN_KEY))
    }
    return options;
  }

  get refreshHeader() {
    const options = {
      headers: new HttpHeaders().append("Authorization", "Bearer " + this.localStorageService.get(REF_TOKEN_KEY))
    }
    return options;
  }

  register(user) {
    delete user.confirmPassword;
    this.http.post(REGISTER_API, user).subscribe((data:any) => {
      console.log(data);
      if (data.message) {
        this.router.navigate(['/login']);
        this._snackBar.openFromComponent(SuccessSnackbar, {
          data: data.message,
          duration: 2000
        });
      }
    }, (err:any) => {
      if (err.status == 409)
        this._snackBar.open(err.error.message, "Close", {duration: 2000});
      else
        this._snackBar.openFromComponent(ErrorSnackbar, {
          data: "Something went wrong.",
          duration: 2000
        });
    });
  }

  login(user) {
    this.http.post<LoginResponse>(LOGIN_API, user).subscribe((data:any) => {
      if(!data.accessToken)
        return;
      this.localStorageService.set(ACC_TOKEN_KEY, data.accessToken);
      this.localStorageService.set(REF_TOKEN_KEY, data.refreshToken);
      this.localStorageService.set(FULLNAME_KEY, data.fullName);
      this.authStatus.next(true);

      this.router.navigate(['/']);
      this._snackBar.openFromComponent(SuccessSnackbar, {
        data: data.message,
        duration: 2000
      });
    }, (err:any) => {
      if (err.status == 401 || err.status == 403)
        this._snackBar.open(err.error.message, "Close", {duration: 2000});
      else
        this._snackBar.openFromComponent(ErrorSnackbar, {
          data: "Something went wrong.",
          duration: 2000
        });
      console.log(err);
    });
  }

  //TODO: Post logout to server api
  logout() {
    this.http.get(LOGOUT_API);
    this.localStorageService.remove(ACC_TOKEN_KEY);
    this.localStorageService.remove(REF_TOKEN_KEY);
    this.localStorageService.remove(FULLNAME_KEY);
    this.router.navigate(['/']);
    window.location.reload();
  }

  // Get access token, automatically refresh if necessary
  getAccessToken(): Observable<string> {
    const accessToken = this.localStorageService.get('accessToken');
    const refreshToken = this.localStorageService.get('refreshToken');
    if (!this.jwt.isTokenExpired(accessToken)) {
      return new BehaviorSubject(accessToken);
    } else if (!this.jwt.isTokenExpired(refreshToken)) {
      console.log('refreshing access token');
      const opts = {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + refreshToken
        })
      };
      return this.http.post<RefreshResponse>(REFRESH_API, {}, opts).pipe(
        map(response => {
          this.localStorageService.set('accessToken', response.accessToken);
          console.log('authentication refresh successful');
          return response.accessToken;
        })
      );
    } else {
      const err = {"message": 'No valid token found'};
      return throwError(err);
    }
  }

  // User is logged in
  isAuthenticated(): boolean {
    return localStorage.getItem('fullName') !== null &&
           !this.jwt.isTokenExpired(localStorage.getItem('refreshToken'));
  }

}

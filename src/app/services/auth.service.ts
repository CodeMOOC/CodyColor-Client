import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { environment } from '../../environments/environment';

interface AuthCallbacks {
  onFirebaseSignIn?: (authResult: any) => void;
  onFirebaseSignInError?: (error: any) => Promise<void>;
  onFirebaseSignOut?: () => void;
  onFirebaseUserDeleted?: () => void;
  onFirebaseUserDeletedError?: () => void;
  onUiShown?: () => void;
  onPrivacyClick?: () => void;
  onTosClick?: () => void;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private initialized = false;
  private firebaseUserData: any = {};
  private serverUserData: any = {};
  private startCookieSignIn?: (user: any) => void;
  private cookieNickCallback?: (nickname: string) => void;
  private callbacks: AuthCallbacks = {};

  constructor(private cookieService: CookieService) {}

  setAuthCallbacks(callbacks: AuthCallbacks) {
    this.callbacks = callbacks;
  }

  setCookieNickCallback(callback: (nickname: string) => void) {
    if (!this.serverUserData.nickname) {
      this.cookieNickCallback = callback;
    }
  }

  enableCookieSignIn() {
    this.startCookieSignIn = (user) => {
      console.log('1/2 [CookieSignIn] - User', user.email);
      this.firebaseUserData = user;

      const cookieData = this.cookieService.get('serverUserData');
      if (cookieData) {
        console.log('2/2 [CookieSignIn] - Cookie nickname validated.');
        this.serverUserData = JSON.parse(cookieData);
      } else {
        console.log(
          '2/2 [CookieSignIn] - Cookie nickname not found. Logging out.'
        );
        this.logout();
      }

      if (this.cookieNickCallback) {
        this.cookieNickCallback(this.serverUserData.nickname);
        this.cookieNickCallback = undefined;
      }
    };
  }

  disableCookieSignIn() {
    this.startCookieSignIn = undefined;
  }

  initializeAuth() {
    if (!this.initialized) {
      firebase.initializeApp(environment.firebaseConfig);
      firebase.auth().onAuthStateChanged((user) => {
        if (user && this.startCookieSignIn) {
          this.startCookieSignIn(user);
          this.startCookieSignIn = undefined;
        }
      });
      this.initialized = true;
    }
  }

  logout() {
    this.cookieService.delete('serverUserData');
    this.serverUserData = {};
    this.firebaseUserData = {};
    firebase
      .auth()
      .signOut()
      .then(() => {
        this.callbacks.onFirebaseSignOut?.();
      });
  }

  deleteAccount() {
    firebase
      .auth()
      .currentUser?.delete()
      .then(() => {
        this.cookieService.delete('serverUserData');
        this.serverUserData = {};
        this.firebaseUserData = {};
        this.callbacks.onFirebaseUserDeleted?.();
      })
      .catch(() => {
        this.callbacks.onFirebaseUserDeletedError?.();
      });
  }

  loginCompleted(): boolean {
    return !!(
      Object.keys(this.serverUserData).length &&
      Object.keys(this.firebaseUserData).length
    );
  }

  setFirebaseUserData(user: any) {
    this.firebaseUserData = user;
  }

  getFirebaseUserData(): any {
    return this.firebaseUserData;
  }

  setServerUserData(userData: any) {
    this.cookieService.set('serverUserData', JSON.stringify(userData));
    this.serverUserData = userData;
  }

  getServerUserData(): any {
    return this.serverUserData;
  }
}

import { inject, Inject, Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  Auth,
  authState,
  signOut,
  deleteUser,
  User,
  onAuthStateChanged,
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  user,
  FacebookAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from '@angular/fire/auth';
import { initializeApp } from 'firebase/app';
import { environment } from '../../environments/environment';
import { RabbitService } from './rabbit.service';

import { AppUser, ServerUserData } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private initialized = false;
  private auth = inject(Auth);

  private userSubject = new BehaviorSubject<AppUser>({
    firebaseUser: null,
    serverData: null,
  });
  user$: Observable<AppUser> = this.userSubject.asObservable();

  private authErrorSubject = new BehaviorSubject<string | null>(null);
  authError$ = this.authErrorSubject.asObservable();

  private authReadySubject = new BehaviorSubject<boolean>(false);
  authReady$ = this.authReadySubject.asObservable();

  constructor(
    private cookieService: CookieService,
    private rabbitService: RabbitService
  ) {}

  initializeAuth() {
    if (!this.initialized) {
      initializeApp(environment.firebaseConfig);

      onAuthStateChanged(this.auth, async (user: User | null) => {
        if (user) {
          // Restore server data from cookie if available
          const cookie = this.cookieService.get('serverUserData');
          if (cookie) {
            const serverUserData = JSON.parse(cookie);

            this.userSubject.next({
              firebaseUser: user,
              serverData: serverUserData,
            });
            // this.firebaseUserSubject.next(user);
          } else {
            // Ask backend (via Rabbit) for server-side info using Firebase UID
            this.rabbitService.sendLogInRequest(user.uid);

            const loginResponseSub =
              this.rabbitService.loginResponse$.subscribe((msg) => {
                if (
                  msg?.msgType ===
                  this.rabbitService.messageTypes.s_authResponse
                ) {
                  if (msg.success && msg.nickname) {
                    this.setServerUserData(msg);

                    // User already has a nickname, proceed to profile
                    this.userSubject.next({
                      firebaseUser: user,
                      serverData: msg,
                    });
                  } else if (msg.success && !msg.nickname) {
                    // User exists in backend but has no nickname yet
                    this.userSubject.next({
                      firebaseUser: user,
                      serverData: null, // allow setting nickname
                    });
                  } else {
                    // Real login failure
                    console.warn('[Auth] Server login failed. Logging out.');
                    this.logout();
                  }
                }
              });
          }
        }
        this.authReadySubject.next(true);
      });

      this.initialized = true;
    }
  }

  get currentUser(): AppUser {
    return this.userSubject.value;
  }

  setServerUserData(serverUser: ServerUserData) {
    this.cookieService.set('serverUserData', JSON.stringify(serverUser));
  }

  async signInWithEmail(email: string, password: string) {
    const userCredential = await signInWithEmailAndPassword(
      this.auth,
      email,
      password
    );
    const serverData = await this.rabbitService.sendLogInRequestAndWait(
      userCredential.user.uid
    );
    this.userSubject.next({ firebaseUser: userCredential.user, serverData });
  }

  async signUpWithEmail(
    email: string,
    password: string,
    extraFields: { name: string; surname: string }
  ) {
    const userCredential = await createUserWithEmailAndPassword(
      this.auth,
      email,
      password
    );
    this.userSubject.next({
      firebaseUser: userCredential.user,
      serverData: null,
    });
  }

  getFirebaseErrorMessage(err: any) {
    switch (err.code) {
      case 'auth/invalid-email':
        return 'ERR_INVALID_EMAIL';
      case 'auth/user-disabled':
        return 'ERR_USER_DISABLED';
      case 'auth/user-not-found':
        return 'ERR_USER_NOT_FOUND';
      case 'auth/wrong-password':
        return 'ERR_WRONG_PASSWORD';
      case 'auth/email-already-in-use':
        return 'ERR_EMAIL_EXISTS';

      default:
        return 'ERR_LOGIN';
    }
  }

  async loginWithGoogle(): Promise<void> {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;

      // ask backend for server data
      const serverData = await this.rabbitService.sendLogInRequest(
        firebaseUser.uid
      );
      // Subscribe to login response
      const sub = this.rabbitService.loginResponse$.subscribe((msg) => {
        if (msg.success && msg.nickname) {
          this.userSubject.next({ firebaseUser, serverData: msg });
        } else {
          this.userSubject.next({ firebaseUser, serverData: null });
        }
        sub.unsubscribe();
      });
    } catch (err) {
      console.error('Google login failed:', err);
      this.authErrorSubject.next('ERR_LOGIN');
    }
  }

  async loginWithFacebook(): Promise<void> {
    try {
      const auth = getAuth();
      const provider = new FacebookAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;

      // ask backend for server data
      this.rabbitService.sendLogInRequest(firebaseUser.uid);

      // Subscribe to login response
      const sub = this.rabbitService.loginResponse$.subscribe((msg) => {
        if (msg.success && msg.nickname) {
          this.userSubject.next({ firebaseUser, serverData: msg });
        } else {
          this.userSubject.next({ firebaseUser, serverData: null });
        }
        sub.unsubscribe();
      });
    } catch (err) {
      console.error('Facebook login failed:', err);
      this.authErrorSubject.next('ERR_LOGIN');
    }
  }

  async completeSignUp(nickname: string, email: string): Promise<void> {
    const firebaseUser = this.userSubject.value.firebaseUser;
    if (!firebaseUser) return;

    try {
      const serverData = await this.rabbitService.sendSignUpRequestAndWait(
        nickname,
        email ?? firebaseUser.email ?? '',
        firebaseUser.uid
      );

      this.userSubject.next({ firebaseUser, serverData });
    } catch (err) {
      console.error('Sign up failed', err);
      this.authErrorSubject.next('ERR_SIGNUP');
    }
  }

  loginCompleted(): boolean {
    const user = this.userSubject.value;
    return !!user.firebaseUser && !!user.serverData;
  }

  async logout() {
    this.cookieService.delete('serverUserData');
    this.userSubject.next({ firebaseUser: null, serverData: null });
    await signOut(this.auth);
  }

  async deleteAccount(): Promise<void> {
    const firebaseUser = this.userSubject.value.firebaseUser;
    if (!firebaseUser) return;

    try {
      // delete backend user
      await this.rabbitService.sendUserDeleteRequest(firebaseUser.uid);

      // delete firebase user
      await deleteUser(firebaseUser);

      // update auth state
      this.userSubject.next({ firebaseUser: null, serverData: null });
    } catch (err) {
      console.error('Delete account failed', err);
      this.authErrorSubject.next('ERR_DELETE_ACCOUNT');
    }
  }
}

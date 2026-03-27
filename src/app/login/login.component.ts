import { Component, inject } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { AudioService } from '../services/audio.service';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { GameDataService } from '../services/game-data.service';
import { MultiOptionsModalComponent } from '../components/multi-options-modal/multi-options-modal.component';
import { SingleOptionModalComponent } from '../components/single-option-modal/single-option-modal.component';
import { RabbitService } from '../services/rabbit.service';
import { Auth, sendPasswordResetEmail } from '@angular/fire/auth';
import { Router } from '@angular/router';

enum ScreenState {
  Loading = 'loadingScreen',
  Login = 'login',
  Profile = 'profile',
  Nickname = 'nicknameSelection',
}

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MultiOptionsModalComponent,
    SingleOptionModalComponent,
    TranslateModule,
  ],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  screen = ScreenState.Loading;
  ScreenState = ScreenState;
  firebaseUserData: any;
  serverUserData: any;
  pendingRedirect = false;
  userLogged = false;
  userNickname = '';
  hideSignUpButton = false;

  multiOptionsModal = false;
  multiOptionsText = '';
  singleOptionModal = false;
  singleOptionText = '';
  languageModal = false;
  basePlaying = false;

  isSignUp = false;
  loading = false;

  infoVisible = false;
  private infoTimeout: any;

  authForm!: FormGroup;

  showPassword = false;
  showRepeatPassword = false;

  isSubmissionInProgress = false;

  private subs: Subscription[] = [];

  private gameData = inject(GameDataService);

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private auth: AuthService,
    private firebaseAuth: Auth,
    private rabbit: RabbitService,
    private audio: AudioService,
    private router: Router
  ) {}

  timeFormatter = this.gameData.formatTimeDecimals;

  ngOnInit(): void {
    this.authForm = this.fb.group({
      name: [''],
      surname: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      repeatPassword: [''],
      nickname: [''],
    });

    this.basePlaying = this.audio.isEnabled();

    // subscribe to auth state
    this.subs.push(
      this.auth.user$.subscribe((user) => {
        this.firebaseUserData = user;
        this.userLogged = !!user;
        this.userNickname =
          user?.serverData?.nickname ?? this.translate.instant('NOT_LOGGED');

        if (user.firebaseUser === null && user.serverData === null) {
          this.screen = ScreenState.Loading;
        }
        if (user?.firebaseUser && user?.serverData) {
          this.router.navigate(['/profile']);
          return;
          // this.serverUserData = user.serverData;
          // this.firebaseUserData = user.firebaseUser;
          // this.screen = ScreenState.Profile;
          // this.userNickname = user.serverData.nickname;
        } else if (user?.firebaseUser) {
          this.screen = ScreenState.Nickname;
        } else {
          this.screen = ScreenState.Login;
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }

  toggleMode() {
    this.isSignUp = !this.isSignUp;
  }

  ultimateSignUp(nickname: string) {
    this.hideSignUpButton = true;
    this.auth.completeSignUp(
      this.authForm.value.nickname,
      this.authForm.value.email
    );
  }

  logout() {
    this.showMultiOption('SURE_TO_LOGOUT', () => {
      this.multiOptionsModal = false;
      this.auth.logout();
    });
  }

  deleteAccount() {
    this.showMultiOption('SURE_TO_DELETE', () => {
      this.auth.deleteAccount();
      this.multiOptionsModal = false;
    });
  }

  onForgotPassword(): void {
    const email = this.authForm.get('email')?.value;

    if (!email) {
      this.singleOptionText = 'Please enter your email first';
      this.singleOptionModal = true;
      return;
    }
    sendPasswordResetEmail(this.firebaseAuth, email)
      .then(() => {
        this.singleOptionText = 'Password reset email sent';
        this.singleOptionModal = true;
      })
      .catch(() => {
        this.singleOptionText = 'Failed to send reset email';
        this.singleOptionModal = true;
      });
  }

  // helpers
  private showSingleOption(key: string) {
    this.audio.playSound('menu-click');
    this.translate.get(key).subscribe((res: string) => {
      this.singleOptionText = res;
      this.singleOptionModal = true;
    });
  }
  private showMultiOption(key: string, okAction: () => void) {
    this.audio.playSound('menu-click');
    this.multiOptionsText = this.translate.instant(key);
    this.multiOptionsModal = true;
    // Template will call okAction on confirmation
    this.multiOptionsOk = okAction;
  }

  multiOptionsOk = () => {};

  multiOptionsCancel() {
    this.audio.playSound('menu-click');
    this.multiOptionsModal = false;
  }

  singleOptionOk() {
    this.audio.playSound('menu-click');
    this.singleOptionModal = false;
  }

  goToHome() {
    this.audio.playSound('menu-click');
    this.pendingRedirect = true;
    setTimeout(() => {
      window.location.href = '/';
    }, 300);
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleRepeatPassword(): void {
    this.showRepeatPassword = !this.showRepeatPassword;
  }
  showInfo() {
    this.infoVisible = true;
    clearTimeout(this.infoTimeout);
    this.infoTimeout = setTimeout(() => (this.infoVisible = false), 3000); // auto hide after 3s
  }

  hideInfo() {
    this.infoVisible = false;
  }

  toggleInfo() {
    this.infoVisible = !this.infoVisible;
    if (this.infoVisible) {
      clearTimeout(this.infoTimeout);
      this.infoTimeout = setTimeout(() => (this.infoVisible = false), 3000);
    }
  }

  async onFacebookLogin() {
    await this.auth.loginWithFacebook();
  }

  async onGoogleLogin() {
    await this.auth.loginWithGoogle();
  }

  async submitAuth() {
    if (this.authForm.invalid) {
      this.authForm.markAllAsTouched();
      return;
    }

    const { email, password, repeatPassword, name, surname } =
      this.authForm.value;
    this.loading = true;

    try {
      if (this.isSignUp) {
        if (password !== repeatPassword) {
          this.showSingleOption(this.translate.instant('PASSWORD_MISMATCH'));
          return;
        }

        await this.auth.signUpWithEmail(email!, password!, { name, surname });
        await this.auth.completeSignUp(
          this.authForm.value.nickname,
          this.authForm.value.email
        );
      } else {
        await this.auth.signInWithEmail(email!, password!);
        this.router.navigate(['/profile']);
      }
    } catch (err: any) {
      const errorMessage = this.auth.getFirebaseErrorMessage(err);
      this.showSingleOption(errorMessage);
    } finally {
      this.loading = false;
    }
  }
}

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AppUser, ServerUserData } from '../../models/user.model';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RabbitService } from '../../services/rabbit.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { AudioService } from '../../services/audio.service';
import { MultiOptionsModalComponent } from '../../components/multi-options-modal/multi-options-modal.component';
import { SessionService } from '../../services/session.service';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-profile',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MultiOptionsModalComponent,
    TranslateModule,
  ],
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  nickname: string = '';
  userNickname: string = '';
  userLogged: boolean = false;

  serverUser!: ServerUserData;
  firebaseUser: any;

  editMode = false;
  editableNickname = '';
  multiOptionsText = '';
  multiOptionsModal = false;
  pendingRedirect = false;

  user: any;

  constructor(
    private translate: TranslateService,
    private firebaseAuth: Auth,
    private rabbit: RabbitService,
    private audio: AudioService,
    private auth: AuthService,
    private session: SessionService,
    private router: Router,
    private translation: LanguageService
  ) {}

  ngOnInit(): void {
    // Session check
    if (this.session.isSessionInvalid()) {
      this.router.navigate(['/']);
      return;
    }

    this.auth.user$.subscribe(user => {
      this.userLogged = !!user.firebaseUser && !!user.serverData;
  
      if (!this.userLogged) return;
  
      this.user = user;
      this.firebaseUser = user.firebaseUser;
      this.serverUser = user.serverData!;
    });
    if (this.auth.loginCompleted()) {
      queueMicrotask(() => this.initProfile());
    }
  }

  async initProfile(): Promise<void> {
    await this.rabbit.waitForBrokerConnection();

    this.rabbit
      .sendGetUserStatsRequestAndWait(this.user.firebaseUser?.uid ?? '')
      .then((res) => {
        
        const { avgPoints, bestMatch, totalMatches, totalPoints, wonMatches } = res;
        this.serverUser = { ...this.serverUser, avgPoints, bestMatch, totalMatches, totalPoints, wonMatches };
        this.auth.setServerUserData(this.serverUser);
      })
      .catch((err) => {
        console.warn('Failed to load user stats', err);
      });
  }

  // Default avatar if Firebase photoURL is missing
  get avatarUrl(): string {
    const url = this.firebaseUser?.photoURL;
    return url ? url : 'assets/img/user-avatar.png';
  }

  enterEditMode() {
    this.editMode = true;
    this.editableNickname = this.serverUser.nickname;
  }

  async saveNickname() {
    await this.rabbit.waitForBrokerConnection();

    this.serverUser.nickname = this.editableNickname.trim();
    this.rabbit.sendEditNicknameRequest(
      this.firebaseUser.uid,
      this.serverUser.nickname
    );
    this.auth.setServerUserData(this.serverUser);

    this.editMode = false;
  }

  goToHome() {
    this.audio.playSound('menu-click');
    this.pendingRedirect = true;
    setTimeout(() => {
      window.location.href = '/';
    }, 300);
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
  deleteAccount() {
    this.showMultiOption('SURE_TO_DELETE', () => {
      this.auth.deleteAccount();
      this.multiOptionsModal = false;
    });
  }

  logout() {
    this.showMultiOption('SURE_TO_LOGOUT', async () => {
      this.multiOptionsModal = false;
      await this.auth.logout();

      this.router.navigate(['/login']);
    });
  }
  cancelEdit() {
    this.editMode = false;
    this.editableNickname = this.serverUser.nickname;
  }
}

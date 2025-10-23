import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DialogLanguageComponent } from '../../dialog-language/dialog-language.component';
import { AudioService } from '../../../services/audio.service';
import { ExitGameModalComponent } from '../../exit-game-modal/exit-game-modal.component';
import { PathService } from '../../../services/path.service';
import { GameDataService } from '../../../services/game-data.service';
import { filter } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { RabbitService } from '../../../services/rabbit.service';

@Component({
  selector: 'app-footer',
  imports: [CommonModule, TranslateModule],
  standalone: true,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent implements OnInit {
  basePlaying = false;
  languageModal = false;
  language = 'it';
  userLogged = false;
  userNickname = 'Guest';
  exitGameModal = false;
  showExitButton = true;

  constructor(
    private auth: AuthService,
    private audio: AudioService,
    private dialog: MatDialog,
    private gameData: GameDataService,
    private matDialog: MatDialog,
    private rabbit: RabbitService,
    private router: Router,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.userLogin();
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.showExitButton = event.urlAfterRedirects !== '/home';
      });
  }

  userLogin(): void {
    this.auth.user$.subscribe(() => {
      const appUser = this.auth.currentUser;

      this.userLogged = !!appUser.firebaseUser && !!appUser.serverData;

      if (this.userLogged && appUser.serverData) {
        this.userNickname = appUser.serverData.nickname;
      } else {
        this.translate.get('NOT_LOGGED').subscribe((res: string) => {
          this.userNickname = res;
        });
      }
    });
  }

  openExitGameDialog(): void {
    const currentUrl = this.router.url;
    if (currentUrl === '/login') {
      this.goToHome();
      return;
    }
    const dialogRef = this.dialog.open(ExitGameModalComponent, {
      width: '400px',
      disableClose: true,
      autoFocus: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.quitGame();
      }
    });
  }

  stopExit(): void {
    this.audio.playSound('menu-click');
    this.exitGameModal = false;
  }

  private quitGame(): void {
    // this.pathService.quitGame();
    this.gameData.reset();
  }
  onExitGame(): void {
    this.audio.playSound('menu-click');
    this.exitGameModal = true;
  }

  continueExit(): void {
    this.audio.playSound('menu-click');
    this.quitGame();
    this.router.navigate(['/home']);
  }

  goToHome() {
    this.router.navigate(['/home']);
  }

  openLanguageModal() {
    const dialog = this.matDialog
      .open(DialogLanguageComponent, {
        width: '300px',
        data: {
          currentLanguage: this.language,
          availableLanguages: this.translate.getLangs(),
        },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.changeLanguage(result);
        }
      });
  }

  closeLanguageModal() {
    this.languageModal = false;
  }

  toggleBase() {
    this.basePlaying = !this.basePlaying;
    this.audio.toggleBase();
  }

  changeLanguage(lang: string) {
    this.language = lang;
    this.translate.use(lang);
  }

  navigateToLogin() {
    if (this.rabbit.getServerConnectionState()) {
      this.router.navigate(['/login']);
    }
    return;
  }
}

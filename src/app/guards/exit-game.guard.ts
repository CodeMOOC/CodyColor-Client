// import { inject } from '@angular/core';
// import { CanDeactivateFn, Router } from '@angular/router';
// import { MatDialog } from '@angular/material/dialog';
// import { ExitGameModalComponent } from '../components/exit-game-modal/exit-game-modal.component';
// import { RabbitService } from '../services/rabbit.service';
// import { GameDataService } from '../services/game-data.service';
// import { PathService } from '../services/path.service';
// import { MatchManagerService } from '../services/match-manager.service';
// import { firstValueFrom } from 'rxjs';

// let exiting = false;

// export const exitGameGuard: CanDeactivateFn<any> = async (
//   component,
//   currentRoute,
//   currentState,
//   nextState
// ) => {
//   const dialog = inject(MatDialog);
//   const router = inject(Router);
//   const rabbit = inject(RabbitService);
//   const gameData = inject(GameDataService);
//   const path = inject(PathService);
//   const matchManager = inject(MatchManagerService);

//   constructor(private router: Router) {}
//   if (exiting) return false; // prevent recursion
//   exiting = true;
//   console.log('Exit game guard triggered');
//   const nav = this.router.getCurrentNavigation();

//   const dialogRef = dialog.open(ExitGameModalComponent, {
//     disableClose: true,
//   });

//   const confirmed = await firstValueFrom(dialogRef.afterClosed());

//   if (!confirmed) return false;

//   // Centralized reset
//   rabbit.sendPlayerQuitRequest();
//   rabbit.quitGame();
//   path.reset();
//   gameData.reset();
//   matchManager.resetMatchState();

//   router.navigate(['/home'], { replaceUrl: true });

//   return false;
// };

import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanDeactivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ExitGameModalComponent } from '../components/exit-game-modal/exit-game-modal.component';
import { RabbitService } from '../services/rabbit.service';
import { PathService } from '../services/path.service';
import { GameDataService } from '../services/game-data.service';
import { MatchManagerService } from '../services/match-manager.service';
import { GameLifecycleService } from '../services/game-lifecycle.service';

@Injectable({ providedIn: 'root' })
export class exitGameGuard implements CanDeactivate<unknown> {
  constructor(
    private dialog: MatDialog,
    private rabbit: RabbitService,
    private router: Router,
    private gameLifecycle: GameLifecycleService
  ) {}

  canDeactivate(
    component: unknown,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    const currentMode = currentRoute.data['gameMode'];

    const navigation = this.router.getCurrentNavigation();
    // Only block browser back/forward
    if (navigation?.trigger === 'popstate') {
      const dialogRef = this.dialog.open(ExitGameModalComponent, {
        disableClose: true,
        width: '400px',
      });

      return dialogRef.afterClosed().pipe(
        map((confirmed) => {
          if (confirmed) {
            this.rabbit.sendPlayerQuitRequest();
            this.gameLifecycle.leaveGame();
            return true;
          }
          return false;
        })
      );
    }
    return true;
  }
}

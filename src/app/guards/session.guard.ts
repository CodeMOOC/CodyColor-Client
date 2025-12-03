import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionService } from '../services/session.service';
import { GameResetService } from '../services/game-reset.service';

export const sessionGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const session = inject(SessionService);
  const gameReset = inject(GameResetService);

  // Check if the session is invalid
  if (session.isSessionInvalid()) {
    gameReset.quitGame(router.url);
    router.navigate(['/']);
    return false;
  }

  return true;
};

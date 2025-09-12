import { Injectable } from '@angular/core';
import { WakeLockService } from './wake-lock.service';

interface GeneralInfo {
  totalMatches: number;
  connectedPlayers: number;
  randomWaitingPlayers: number;
  requiredClientVersion?: string;
}

@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly clientVersion = '3.3.4';

  private readonly sessionId: string = Math.floor(
    Math.random() * 100000
  ).toString();

  private isSessionValid: boolean | undefined;

  private generalInfo: GeneralInfo = {
    totalMatches: 0,
    connectedPlayers: 0,
    randomWaitingPlayers: 0,
    requiredClientVersion: undefined,
  };

  constructor(private wakeLockService: WakeLockService) {}
  // Prevent screen from sleeping
  enableNoSleep(): void {
    try {
      this.wakeLockService.requestWakeLock();
    } catch (err) {
      console.warn('wake lock could not be enabled:', err);
    }
  }

  disableNoSleep(): void {
    this.wakeLockService.releaseWakeLock();
  }

  // Session validity
  validateSession(): void {
    this.isSessionValid = true;
  }

  isSessionInvalid(): boolean {
    return this.isSessionValid !== true;
  }

  // General info
  setGeneralInfo(info: GeneralInfo): void {
    this.generalInfo = { ...info };
  }

  getTotalMatches(): number {
    return this.generalInfo.totalMatches;
  }

  getConnectedPlayers(): number {
    return this.generalInfo.connectedPlayers;
  }

  getRandomWaitingPlayers(): number {
    return this.generalInfo.randomWaitingPlayers;
  }

  getRequiredClientVersion(): string | undefined {
    return this.generalInfo.requiredClientVersion;
  }

  isClientVersionValid(): boolean {
    const required = this.generalInfo.requiredClientVersion;
    return !required || required === this.clientVersion;
  }

  getClientVersion(): string {
    return this.clientVersion;
  }

  getSessionId(): string {
    return this.sessionId;
  }
}

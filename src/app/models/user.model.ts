import { User } from '@angular/fire/auth';

export interface AppUser {
  firebaseUser: User | null;
  serverData?: ServerUserData | null;
}

export interface ServerUserData {
  msgType: string;
  success: boolean;
  nickname: string;
  totalPoints: number;
  wonMatches: number;
  avgPoints: number;
  bestMatch: { points: number; pathLength: number; time: number };
  correlationId: string;
  msgId: string;
}

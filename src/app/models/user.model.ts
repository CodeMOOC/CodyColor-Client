import { User } from '@angular/fire/auth';

export interface AppUser {
  firebaseUser: User | null;
  serverData?: ServerUserData | null;
}

export interface ServerUserData {
  nickname: string;
  name?: string;
  surname?: string;
  stats?: UserStats;
  msgType: string;
  success: boolean;
  correlationId: string;
  msgId: string;
}

export interface UserStats {
  totalPoints: number;
  wonMatches: number;
  avgPoints: number;
  totalMatches: number;
  bestMatch: { points: number; pathLength: number; time: number };
}
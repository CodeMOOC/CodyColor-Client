import { Match, MatchResult } from './match.model';
import { Player } from './player.model';

export type GameType = 'bootmp' | 'random' | 'custom' | 'royale';

export interface GameData {
  general: GeneralSettings;
  user: Player;
  enemy: Player;
  aggregated: Aggregated;
  match: Match;
  matchRanking: MatchResult[];
  globalRanking: GlobalResult[];
  userMatchResult: MatchResult;
  enemyMatchResult: MatchResult;
  userGlobalResult: GlobalResult;
  enemyGlobalResult: GlobalResult;
}

export interface GeneralSettings {
  gameName?: string;
  startDate?: Date;
  scheduledStart: boolean;
  gameRoomId: number;
  timerSetting: number;
  maxPlayersSetting: number;
  code: string;
  gameType?: GameType;
  botSetting: number;
}

export interface Aggregated {
  connectedPlayers: number;
  positionedPlayers: number;
  readyPlayers: number;
  matchCount: number;
}

export interface GlobalResult {
  nickname: string;
  playerId: number;
  wonMatches: number;
  points: number;
}

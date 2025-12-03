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
  startDate?: number;
  scheduledStart: boolean;
  gameRoomId: number;
  timerSetting: number;
  maxPlayersSetting: number;
  code: string;
  gameType?: GameType;
  botSetting: number;
}
export const createDefaultGeneral = (): GeneralSettings => ({
  code: '0000',
  gameType: undefined,
  scheduledStart: false,
  gameRoomId: 0,
  timerSetting: 30000,
  maxPlayersSetting: 2,
  botSetting: 0,
});

export interface Aggregated {
  connectedPlayers: number;
  positionedPlayers: number;
  readyPlayers: number;
  matchCount: number;
}

export const createDefaultAggregated = (): Aggregated => ({
  connectedPlayers: 0,
  positionedPlayers: 0,
  readyPlayers: 0,
  matchCount: 0,
});

export interface GlobalResult {
  nickname: string;
  playerId: number;
  wonMatches: number;
  points: number;
}

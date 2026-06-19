export interface Player {
  nickname: string;
  organizer: boolean;
  playerId: number;
  validated: boolean;
}

export const createDefaultPlayer = (): Player => ({
  nickname: 'Anonymous',
  validated: false,
  organizer: false,
  playerId: -1,
});

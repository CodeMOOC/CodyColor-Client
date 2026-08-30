export interface MyRank {
  position: number;
  points: number;
  wonMatches: number;
}

interface MyGlobalMatchRank {
  position: number;
  points: number;
  time: number;
  pathLength: number;
}

interface MyGlobalPointsRank {
  position: number;
  points: number;
  wonMatches: number;
}

export interface RankingsData {
  top10MatchDaily?: any[];
  top10MatchGlobal?: any[];
  top10PointsDaily?: any[];
  top10PointsGlobal?: any[];
  myGlobalMatchRank?: MyGlobalMatchRank;
  myGlobalPointsRank?: MyGlobalPointsRank;
}
